import { Expense } from "./Expense";
export class Group {
    id: string;
    name: string;
    members: string[];
    expenses: Expense[];

    constructor(id: string, name: string, members: string[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.expenses = [];
    }

    addMember(memberName: string): void {
        if (!memberName.trim()) {
            throw new Error("Member name cannot be empty");
        }

        if (this.members.includes(memberName)) {
            throw new Error("Member already exists in the group");
        }

        this.members.push(memberName);
    }

    addExpense(expense: Expense): void {
        this.expenses.push(expense);
    }
}