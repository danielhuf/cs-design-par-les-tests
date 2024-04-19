import { PayOff } from "../domain/entities/PayOff";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 
import { GroupNotFoundError } from "../domain/errors/GroupErrors";
import { PayOffValidator } from "../domain/validators/PayOffValidator";

export class MemberPaysOffDebt {
  private repository: IGroupRepository;

  constructor(groupRepository: IGroupRepository) {
    this.repository = groupRepository;
  }

  execute(groupId: string, title:string, payTo: string, amount: number, payerName: string, date: Date) {
    const group = this.repository.findGroup(groupId);
    if (!group) {
        throw new GroupNotFoundError();
    }

    PayOffValidator.validateExpenseTitle(title);
    PayOffValidator.validatePayOffAmount(amount);
    PayOffValidator.validateGroupMembers(group.members, payerName, payTo);
    PayOffValidator.validatePayOffDate(date);
    
    const payOff = new PayOff(title, amount, payerName, date, payTo);
    group.payOffDebt(payOff);
    return group;
  }
}