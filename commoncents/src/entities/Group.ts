import { Expense } from "./Expense";
import { Member } from "./Member";
export class Group {
    id: string;
    name: string;
    members: Member[];
    expenses: Expense[];

    constructor(id: string, name: string, members: Member[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.expenses = [];
    }

    addMember(member: Member): void {
        this.members.push(member);
    }

    addExpense(expense: Expense): void {
        this.expenses.push(expense);
    }
}