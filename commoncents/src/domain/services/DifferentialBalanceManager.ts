import { Member } from "../entities/Member";
import { Expense } from "../entities/Expense";
import { PayOff } from "../entities/PayOff";
import { SimplifiedBalanceCalculator } from "./SimplifiedBalanceCalculator";
import e from "express";

export class DifferentialBalanceManager {
    private balances: { [key: string]: { [key: string]: number } };
    private simplfiedBalances: { [key: string]: { [key: string]: number } };
    private simplifiedBalanceCalculator: SimplifiedBalanceCalculator;

    constructor(private members: Member[]) {
        this.balances = {};
        this.simplfiedBalances = {};
        this.simplifiedBalanceCalculator = new SimplifiedBalanceCalculator();
        this.initializeBalances();
    }

    private initializeBalances(): void {
        this.members.forEach(member => {
            // Ensure the main member key is initialized to an object.
            if (!this.balances[member.name]) {
                this.balances[member.name] = {};
            }
            if (!this.simplfiedBalances[member.name]) {
                this.simplfiedBalances[member.name] = {};
            }

            this.members.forEach(m => {
                if (m.name !== member.name) {
                    // Initialize nested member keys to 0 if they don't exist yet.
                    this.balances[member.name][m.name] = 0;
                    this.simplfiedBalances[member.name][m.name] = 0;

                    this.balances[m.name] = this.balances[m.name] || {};
                    this.simplfiedBalances[m.name] = this.simplfiedBalances[m.name] || {};

                    this.balances[m.name][member.name] = 0;
                    this.simplfiedBalances[m.name][member.name] = 0;
                }
            });
        });
    }

    updateBalances(expense: Expense | PayOff): void {
        if (expense instanceof Expense) {
            this.updateBalancesForExpense(expense);
        } else if (expense instanceof PayOff) {
            this.updateBalancesForPayOff(expense);
        }
    }

    private updateBalancesForExpense(expense: Expense): void {
        const totalAmount = expense.amount;
        let expectedShares: { [key: string]: number } = {};

        if (expense.isPercentual) {
            expectedShares = this.calculatePercentualShares(expense.split, totalAmount);
        } else {
            expectedShares = { ...expense.split };
        }

        for (const [member, share] of Object.entries(expectedShares)) {
            if (member !== expense.payerName) {
                const amountOwedByMember = share;
                this.updateDifferentialBalance(expense.payerName, member, amountOwedByMember);
                this.updateDifferentialBalance(member, expense.payerName, -amountOwedByMember);
            }
        }
    }

    private calculatePercentualShares(split: { [key: string]: number }, totalAmount: number): { [key: string]: number } {
        const expectedShares: { [key: string]: number } = {};

        for (const [member, percent] of Object.entries(split)) {
            expectedShares[member] = totalAmount * (percent as number) / 100;
        }

        return expectedShares;
    }

    private updateDifferentialBalance(payer: string, payee: string, amount: number): void {
        this.balances[payer][payee] = (this.balances[payer][payee] || 0) + amount;
    }

    private updateBalancesForPayOff(payoff: PayOff): void {
        const amount = payoff.amount;
        const payer = payoff.payerName;
        const payee = payoff.payTo;

        this.updateDifferentialBalance(payer, payee, amount);
        this.updateDifferentialBalance(payee, payer, -amount);
    }

    private updateSimplifiedBalances(): void {
        if (this.members.length <= 2) {
            this.simplfiedBalances = this.balances;
        } else {
            for (const member of this.members) {
                for (const otherMember of this.members) {
                    if (member.name !== otherMember.name) {
                        this.simplfiedBalances[member.name][otherMember.name] = this.simplifiedBalanceCalculator.calculate(this.balances, member.name, otherMember.name);
                    }
                }
            }
        }
    }

    addMember(member: Member): void {
        this.balances[member.name] = {};
        this.simplfiedBalances[member.name] = {};
        this.members.forEach(m => {
            if (m.name !== member.name) {
                this.balances[member.name][m.name] = 0;
                this.balances[m.name][member.name] = 0;
                this.simplfiedBalances[member.name][m.name] = 0;
                this.simplfiedBalances[m.name][member.name] = 0;
            }
        });
    }

    removeMember(memberName: string): void {
        delete this.balances[memberName];
        Object.keys(this.balances).forEach(otherMember => {
            delete this.balances[otherMember][memberName];
        });
        delete this.simplfiedBalances[memberName];
        Object.keys(this.simplfiedBalances).forEach(otherMember => {
            delete this.simplfiedBalances[otherMember][memberName];
        });
    }

    getBalances(): { [key: string]: { [key: string]: number } } {
        return this.balances;
    }

    getSimplifiedBalances(): { [key: string]: { [key: string]: number } } {
        return this.simplfiedBalances;
    }
}
