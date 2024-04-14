import { Expense } from "../entities/Expense";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 

export class MemberAddsExpenseToGroup {

  private repository;

  constructor(groupRepository: IGroupRepository) {
    this.repository = groupRepository;
  }

  execute(groupId: string, title: string, amount: number, payer: string, date: Date, splitPercentages: { [key: string]: number }) {
    const group = this.repository.findGroup(groupId);
    if (!group) {
      throw new Error("Group not found");
    }
    this.validateExpenseTitle(title);
    const expense = new Expense(title, amount, payer, date, splitPercentages);
    group.addExpense(expense);
    return group;
  }

  private validateExpenseTitle(title: string): void {
    if (!title.trim()) {
      throw new Error("Expense title cannot be empty");
    }
  }
}