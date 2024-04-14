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
    this.validateExpenseAmount(amount);
    this.validateGroupMembers(group.members, payer);
    this.validateSplitPercentages(group.members, splitPercentages);
    this.validateExpenseDate(date);

    const expense = new Expense(title, amount, payer, date, splitPercentages);
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

  private validateGroupMembers(groupMembers: string[], payer: string): void {
    if (Object.keys(groupMembers).length === 0) {
      throw new Error("Group has no members");
    } else if (!groupMembers.includes(payer)) {
      throw new Error("Payer is not a member of the group");
    }
  }

  private validateSplitPercentages(groupMembers: string[], splitPercentages: { [key: string]: number }): void {
    for (const member in splitPercentages) {
      if (!groupMembers.includes(member)) {
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