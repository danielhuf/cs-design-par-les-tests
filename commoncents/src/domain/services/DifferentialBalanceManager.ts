import { Member } from "../entities/Member";
import { Expense } from "../entities/Expense";

export class DifferentialBalanceManager {
    private balances: { [key: string]: { [key: string]: number } };
    private simplfiedBalances: { [key: string]: { [key: string]: number } };

    constructor(private members: Member[]) {
        this.balances = {};
        this.simplfiedBalances = {};
        this.initializeBalances();
    }

    private initializeBalances(): void {
        this.members.forEach(member => {
            // Ensure the main member key is initialized to an object.
            if (!this.balances[member.name]) {
                this.balances[member.name] = {};
            }

            this.members.forEach(m => {
                if (m.name !== member.name) {
                    // Initialize nested member keys to 0 if they don't exist yet.
                    this.balances[member.name][m.name] = 0;
                    this.balances[m.name] = this.balances[m.name] || {};
                    this.balances[m.name][member.name] = 0;
                }
            });
        });
    }

    updateBalances(expense: Expense): void {
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
                this.balances[expense.payerName][member] = (this.balances[expense.payerName][member] || 0) + amountOwedByMember;
                this.balances[member][expense.payerName] = (this.balances[member][expense.payerName] || 0) - amountOwedByMember;
            }
        }
    }

    addMember(member: Member): void {
        this.balances[member.name] = {};
        this.members.forEach(m => {
            if (m.name !== member.name) {
                this.balances[member.name][m.name] = 0;
                this.balances[m.name][member.name] = 0;
            }
        });
    }

    removeMember(memberName: string): void {
        delete this.balances[memberName];
        Object.keys(this.balances).forEach(otherMember => {
            delete this.balances[otherMember][memberName];
        });
    }

    getBalances(): { [key: string]: { [key: string]: number } } {
        return this.balances;
    }

    getSimplifiedBalances(): { [key: string]: { [key: string]: number } } {
        return this.simplfiedBalances;
    }
}
