import { Group } from '../../src/domain/entities/Group';
import { Member } from '../../src/domain/entities/Member';
import { Expense } from '../../src/domain/entities/Expense';

describe("Group Entity", () => {
    let group: Group;

    beforeEach(() => {
        group = new Group("1", "Holiday Group");
    });

    it("should add new member", () => {
        const member = new Member("Alice");
        group.addMember(member);
        expect(group.members).toContain(member);
    });

    it("should add new expense and update total balance", () => {
        const expense = new Expense("Dinner", 100, "Alice", new Date(), false, { Alice: 50, Bob: 50 });
        group.addExpense(expense);
        expect(group.expenses).toContain(expense);
        expect(group.total_balance).toEqual(100);
    });

    it("should make total balance sum up all expenses", () => {
        group.addExpense(new Expense("Dinner", 100, "Alice", new Date(), false, { Alice: 50, Bob: 50 }));

        // In this case, even if the percentual does not add up to 100%, the test will pass because this validation was defined on the usecase layer
        group.addExpense(new Expense("Snacks", 50, "Bob", new Date(), true, { Alice: 25, Bob: 25 }));
        expect(group.total_balance).toEqual(150);
    });
});