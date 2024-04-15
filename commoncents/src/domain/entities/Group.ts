import { Expense } from "./Expense";
import { Member } from "./Member";
export class Group {
    id: string;
    name: string;
    members: Member[];
    expenses: Expense[];
    total_balance: number;

    constructor(id: string, name: string, members: Member[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.expenses = [];
        this.total_balance = 0;
    }

    addMember(member: Member): void {
        this.members.push(member);
    }

    addExpense(expense: Expense): void {
        this.expenses.push(expense);
        this.calculateTotalBalance();
    }

    calculateTotalBalance(): void {
        this.total_balance = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    }
}