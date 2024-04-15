import { Expense } from "../domain/entities/Expense";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 
import { GroupNotFoundError } from "../domain/errors/GroupErrors";
import { ExpenseValidator } from "../domain/validators/ExpenseValidator";

export class MemberAddsExpenseToGroup {
  private repository: IGroupRepository;

  constructor(groupRepository: IGroupRepository) {
      this.repository = groupRepository;
  }

  execute(groupId: string, title: string, amount: number, payerName: string, date: Date, isPercentual: boolean, split: { [key: string]: number }) {
      const group = this.repository.findGroup(groupId);
      if (!group) {
          throw new GroupNotFoundError();
      }

      ExpenseValidator.validateExpenseTitle(title);
      ExpenseValidator.validateExpenseAmount(amount);
      ExpenseValidator.validateGroupMembers(group.members, payerName);
      ExpenseValidator.validateSplit(group.members, split, isPercentual, amount);
      ExpenseValidator.validateExpenseDate(date);

      const expense = new Expense(title, amount, payerName, date, isPercentual, split);
      group.addExpense(expense);
      return group;
  }
}