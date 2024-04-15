import { Expense } from "../entities/Expense";
import { Member } from "../entities/Member";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 
import { GroupNotFoundError } from "../errors/GroupErrors";

export class MemberAddsExpenseToGroup {

  private repository;

  constructor(groupRepository: IGroupRepository) {
    this.repository = groupRepository;
  }

  execute(groupId: string, title: string, amount: number, payerName: string, date: Date, splitPercentages: { [key: string]: number }) {
    const group = this.repository.findGroup(groupId);
    if (!group) {
      throw new GroupNotFoundError();
    }
    this.validateExpenseTitle(title);
    this.validateExpenseAmount(amount);
    this.validateGroupMembers(group.members, payerName);
    this.validateSplitPercentages(group.members, splitPercentages);
    this.validateExpenseDate(date);

    const expense = new Expense(title, amount, payerName, date, splitPercentages);
    group.addExpense(expense);
    return group;
  }

  private validateExpenseTitle(title: string): void {
    if (!title.trim()) {
      throw new Error("Expense title cannot be empty");
    }
  }

  private validateExpenseAmount(amount: number): void {
    if (amount < 0) {
      throw new Error("Expense amount cannot be negative");
    } else if (amount === 0) {
      throw new Error("Expense amount cannot be zero");
    }
  }

  private validateGroupMembers(groupMembers: Member[], payerName: string): void {
    if (Object.keys(groupMembers).length === 0) {
      throw new Error("Group has no members");
    } else if (!groupMembers.some(member => member.name === payerName)) {
      throw new Error("Payer is not a member of the group");
    }
  }

  private validateSplitPercentages(groupMembers: Member[], splitPercentages: { [key: string]: number }): void {
    for (const member in splitPercentages) {
      if (!groupMembers.some(groupMember => groupMember.name === member)) {
        throw new Error("Split members are not members of the group");
      }
    }
    if (Object.values(splitPercentages).reduce((a:number, b:number) => a + b, 0) !== 100) {
      throw new Error("Split percentages do not add up to 100%");
    }
  }

  private validateExpenseDate(date: Date): void {
    if (date > new Date()) {
      throw new Error("Expense date cannot be in the future");
    }
  }

}