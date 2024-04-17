import { Expense } from "./Expense";
import { Member } from "./Member";
import { MemberNotFoundError } from "../errors/GroupErrors";

export class Group {
    id: string;
    name: string;
    members: Member[];
    expenses: Expense[];
    total_balance: number;
    differentialBalances: { [key: string]: { [key: string]: number } };

    constructor(id: string, name: string, members: Member[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
        this.expenses = [];
        this.total_balance = 0;
        this.differentialBalances = {};
        this.initializeDifferentialBalances();
    }

    private initializeDifferentialBalances(): void {
        this.members.forEach(member => {
            // Ensure the main member key is initialized to an object.
            if (!this.differentialBalances[member.name]) {
                this.differentialBalances[member.name] = {};
            }
    
            this.members.forEach(m => {
                if (m.name !== member.name) {
                    // Initialize nested member keys to 0 if they don't exist yet.
                    if (this.differentialBalances[member.name][m.name] === undefined) {
                        this.differentialBalances[member.name][m.name] = 0;
                    }
                    if (this.differentialBalances[m.name] === undefined) {
                        this.differentialBalances[m.name] = {};
                    }
                    if (this.differentialBalances[m.name][member.name] === undefined) {
                        this.differentialBalances[m.name][member.name] = 0;
                    }
                }
            });
        });
    }    

    addMember(member: Member): void {
        this.members.push(member);
        this.differentialBalances[member.name] = {};
        this.members.forEach(m => {
            if (m.name !== member.name) {
                this.differentialBalances[member.name][m.name] = 0;
                this.differentialBalances[m.name][member.name] = 0;
            }
        });
    }

    removeMember(memberName: string): void {
        const memberIndex = this.members.findIndex(member => member.name === memberName);
        if (memberIndex === -1) {
            throw new MemberNotFoundError();
        }
        this.members.splice(memberIndex, 1);
        this.removeMemberFromDifferentialBalances(memberName);
    }

    addExpense(expense: Expense): void {
        this.expenses.push(expense);
        this.calculateTotalBalance();
        this.updateDifferentialBalances(expense);
    }

    calculateTotalBalance(): void {
        this.total_balance = this.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    }

    private updateDifferentialBalances(expense: Expense): void {
        const totalAmount = expense.amount;
        let expectedShares: { [key: string]: number } = {};
    
        if (expense.isPercentual) {
            // If the split is in percentages, calculate the actual amount for each member
            for (const [member, percent] of Object.entries(expense.split)) {
                expectedShares[member] = totalAmount * (percent as number) / 100;
            }
        } else {
            // If the split is direct values, use those values as expected shares
            expectedShares = {...expense.split} as { [key: string]: number };
        }
    
        // Iterate over each member's expected share and update the differential balances
        for (const [member, share] of Object.entries(expectedShares)) {
            if (member !== expense.payerName) {
                const amountOwedByMember = share; 
                this.differentialBalances[expense.payerName][member] = (this.differentialBalances[expense.payerName][member] || 0) + amountOwedByMember;
                this.differentialBalances[member][expense.payerName] = (this.differentialBalances[member][expense.payerName] || 0) - amountOwedByMember;
            }
        }
    }
    
    private removeMemberFromDifferentialBalances(memberName: string): void {
        delete this.differentialBalances[memberName];
    
        Object.keys(this.differentialBalances).forEach(otherMember => {
            delete this.differentialBalances[otherMember][memberName];
        });
    }
}