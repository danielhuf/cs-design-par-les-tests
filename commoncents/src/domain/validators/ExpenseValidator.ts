import { Member } from "../entities/Member";

export class ExpenseValidator {
    static validateExpenseTitle(title: string): void {
        if (!title.trim()) {
            throw new Error("Expense title cannot be empty");
        }
    }

    static validateExpenseAmount(amount: number): void {
        if (amount < 0) {
            throw new Error("Expense amount cannot be negative");
        } else if (amount === 0) {
            throw new Error("Expense amount cannot be zero");
        }
    }

    static validateGroupMembers(groupMembers: Member[], payerName: string): void {
        if (groupMembers.length === 0) {
            throw new Error("Group has no members");
        }
        if (!groupMembers.some(member => member.name === payerName)) {
            throw new Error("Payer is not a member of the group");
        }
    }

    static validateSplitPercentages(groupMembers: Member[], splitPercentages: { [key: string]: number }): void {
        for (const member in splitPercentages) {
            if (!groupMembers.some(groupMember => groupMember.name === member)) {
                throw new Error("Split members are not members of the group");
            }
        }
        if (Object.values(splitPercentages).reduce((a, b) => a + b, 0) !== 100) {
            throw new Error("Split percentages do not add up to 100%");
        }
    }

    static validateExpenseDate(date: Date): void {
        if (date > new Date()) {
            throw new Error("Expense date cannot be in the future");
        }
    }
}
