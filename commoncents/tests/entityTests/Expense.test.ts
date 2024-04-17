import { Expense } from '../../src/domain/entities/Expense';
import { Member } from '../../src/domain/entities/Member';

describe('Expense', () => {
    it('should create an expense with correct details', () => {
        const title = "Lunch";
        const amount = 100;
        const payerName = "Alice";
        const date = new Date();
        const isPercentual = true;
        const split = { "Alice": 50, "Bob": 50 };

        const expense = new Expense(title, amount, payerName, date, isPercentual, split);

        expect(expense.title).toBe(title);
        expect(expense.amount).toBe(amount);
        expect(expense.payerName).toBe(payerName);
        expect(expense.date).toEqual(date);
        expect(expense.isPercentual).toBe(isPercentual);
        expect(expense.split).toEqual(split);
    });

    it('should create an expense with correct details in case of equal split', () => {
        const title = "Lunch";
        const amount = 100;
        const payerName = "Alice";
        const date = new Date();
        const isEquallySplit = true;
        const membersSplit = [new Member("Alice"), new Member("Bob")];
        const isPercentual = false;
        const split = {};

        const expense = new Expense(title, amount, payerName, date, isPercentual, split, isEquallySplit, membersSplit);

        expect(expense.title).toBe(title);
        expect(expense.amount).toBe(amount);
        expect(expense.payerName).toBe(payerName);
        expect(expense.date).toEqual(date);
        expect(expense.isEquallySplit).toBe(isEquallySplit);
        expect(expense.isPercentual).toBe(isPercentual);
    });
});
