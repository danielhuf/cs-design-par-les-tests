import { Member } from "../entities/Member";

export class PayOffValidator {
    static validateExpenseTitle(title: string): void {
        if (!title.trim()) {
            throw new Error("Pay off title cannot be empty");
        }
    }
    
    static validatePayOffAmount(amount: number): void {
        if (amount < 0) {
            throw new Error("Pay off amount cannot be negative");
        } else if (amount === 0) {
            throw new Error("Pay off amount cannot be zero");
        }
    }

    static validateGroupMembers(groupMembers: Member[], payerName: string, payTo: string): void {
        if (groupMembers.length === 0) {
            throw new Error("Group has no members");
        }
        if (!groupMembers.some(member => member.name === payerName)) {
            throw new Error("Payer is not a member of the group");
        }
        if (!groupMembers.some(member => member.name === payTo)) {
            throw new Error("Payee is not a member of the group");
        }
    }

    static validatePayOffDate(date: Date): void {
        if (date > new Date()) {
            throw new Error("Pay off date cannot be in the future");
        }
    }
}
