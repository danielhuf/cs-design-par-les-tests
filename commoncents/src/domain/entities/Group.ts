import { Expense } from "./Expense";
import { Member } from "./Member";
import { MemberNotFoundError } from "../errors/GroupErrors";
import { DifferentialBalanceManager } from "../services/DifferentialBalanceManager";
import { PayOff } from "./PayOff";

export class Group {
    id: string;
    name: string;
    members: Member[];
    expenses: Expense[];
    total_balance: number;
    private balanceManager: DifferentialBalanceManager;

    constructor(id: string, name: string, members: Member[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.expenses = [];
        this.total_balance = 0;
        this.balanceManager = new DifferentialBalanceManager(members);
    }

    addMember(member: Member): void {
        this.members.push(member);
        this.balanceManager.addMember(member);
    }

    removeMember(memberName: string): void {
        const memberIndex = this.members.findIndex(member => member.name === memberName);
        if (memberIndex === -1) {
            throw new MemberNotFoundError();
        }
        this.members.splice(memberIndex, 1);
        this.balanceManager.removeMember(memberName);
    }

    addExpense(expense: Expense): void {
        this.expenses.push(expense);
        this.calculateTotalBalance();
        this.balanceManager.updateBalances(expense);
        this.balanceManager.updateSimplifiedBalances(expense);
    }

    payOffDebt(payOff: PayOff): void {
        this.balanceManager.updateBalances(payOff);
    }

    calculateTotalBalance(): void {
        this.total_balance = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    }

    getDifferentialBalance(memberOne: string, memberTwo: string): number {
        const balances = this.balanceManager.getBalances();
        return balances[memberOne] && balances[memberOne][memberTwo];
    }

    getSimplifiedBalance(memberOne: string, memberTwo: string): number {
        const simplifiedBalances = this.balanceManager.getSimplifiedBalances();
        return simplifiedBalances[memberOne] && simplifiedBalances[memberOne][memberTwo];
    }
}