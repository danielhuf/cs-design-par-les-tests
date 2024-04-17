import { MemberAddsExpenseToGroup } from "../../src/usecases/MemberAddsExpenseToGroup";
import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/domain/entities/Member";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";

describe("Member Adds Expense To Group Use Case", () => {

  let groupRepository: GroupRepository;
  let createGroup: CreateGroup;
  let memberAddsExpenseToGroup: MemberAddsExpenseToGroup;

  beforeEach(() => {
    resetMockDatabase();
    groupRepository = new GroupRepository();
    createGroup = new CreateGroup(groupRepository);
    memberAddsExpenseToGroup = new MemberAddsExpenseToGroup(groupRepository);
  });

  it("should add a expense to a group with percentuals", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);

    expect(group.expenses.length).toBe(1);
    expect(group.expenses[0].title).toBe(title);
    expect(group.expenses[0].amount).toBe(amount);
    expect(group.expenses[0].payerName).toBe(payerName);
    expect(group.expenses[0].date).toBe(date);
    expect(group.expenses[0].isPercentual).toBe(isPercentual);
    expect(group.expenses[0].split).toEqual(split);
  });

  it("should add a expense to a group with values", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 30,
      "Bob": 20
    };

    memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);

    expect(group.expenses.length).toBe(1);
    expect(group.expenses[0].title).toBe(title);
    expect(group.expenses[0].amount).toBe(amount);
    expect(group.expenses[0].payerName).toBe(payerName);
    expect(group.expenses[0].date).toBe(date);
    expect(group.expenses[0].isPercentual).toBe(isPercentual);
    expect(group.expenses[0].split).toEqual(split);
  });

  it("should add two expenses to a group with percentuals and values", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title1 = "Dinner";
    const amount1 = 50;
    const payerName1 = "Alice";
    const date1 = new Date();
    const isPercentual1 = true;
    const split1 = {
      "Alice": 50,
      "Bob": 50
    };

    const title2 = "Lunch";
    const amount2 = 20;
    const payerName2 = "Bob";
    const date2 = new Date();
    const isPercentual2 = false;
    const split2 = {
      "Alice": 15,
      "Bob": 5
    };

    memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, isPercentual1, split1);
    memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, isPercentual2, split2);

    expect(group.expenses.length).toBe(2);
    expect(group.expenses[0].title).toBe(title1);
    expect(group.expenses[0].amount).toBe(amount1);
    expect(group.expenses[0].payerName).toBe(payerName1);
    expect(group.expenses[0].date).toBe(date1);
    expect(group.expenses[0].isPercentual).toBe(isPercentual1);
    expect(group.expenses[0].split).toEqual(split1);

    expect(group.expenses[1].title).toBe(title2);
    expect(group.expenses[1].amount).toBe(amount2);
    expect(group.expenses[1].payerName).toBe(payerName2);
    expect(group.expenses[1].date).toBe(date2);
    expect(group.expenses[1].isPercentual).toBe(isPercentual2);
    expect(group.expenses[1].split).toEqual(split2);
  });

  it("should throw an error when adding an expense to a non-existent group", () => {
    const nonExistentGroupId = "fake-id";
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 10,
      "Bob": 40
    };

    expect(() => memberAddsExpenseToGroup.execute(nonExistentGroupId, title, amount, payerName, date, isPercentual, split)).toThrow(GroupNotFoundError);
  });

  it("should throw an error if the title is empty", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const emptyTitle = "";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, emptyTitle, amount, payerName, date, isPercentual, split)).toThrow("Expense title cannot be empty");
  });

  it("should throw an error if the amount is negative", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const negativeAmount = -50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, negativeAmount, payerName, date, isPercentual, split)).toThrow("Expense amount cannot be negative");
  });

  it("should throw an error if the amount is zero", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const zeroAmount = 0;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, zeroAmount, payerName, date, isPercentual, split)).toThrow("Expense amount cannot be zero");
  });

  it("should throw an error if the group has no members", () => {
    const groupName = "Holiday Trip";
    const group = createGroup.execute(groupName);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Group has no members");
  });

  it("should throw an error if the payerName is not a member of the group", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Charlie";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Payer is not a member of the group");
  });

  it("should throw an error if the split members are not members of the group", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 50,
      "Charlie": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Split members are not members of the group");
  });

  it("should throw an error if the percentage split does not add up to 100%", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 40
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Split percentages do not add up to 100%");
  });

  it("should throw an error if the value split does not add up to the total amount", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 5,
      "Bob": 25
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Split amounts do not add up to the total amount");
  });

  it("should throw an error if the split concerns less than two members", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Split must have at least two members");
  });

  it("should throw an error if the date is in the future", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    date.setDate(date.getDate() + 1);
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split)).toThrow("Expense date cannot be in the future");
  });

  it("should update the total balance when an expense is added", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };

    memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);

    expect(group.total_balance).toBe(50);
  });

  it("should add up all the expenses and update total balance", () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title1 = "Dinner";
    const amount1 = 50;
    const payerName1 = "Alice";
    const date1 = new Date();
    const isPercentual1 = true;
    const split1 = {
      "Alice": 60,
      "Bob": 40
    };

    const title2 = "Lunch";
    const amount2 = 20;
    const payerName2 = "Bob";
    const date2 = new Date();
    const isPercentual2 = false;
    const split2 = {
      "Alice": 15,
      "Bob": 5
    };

    memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, isPercentual1, split1);
    memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, isPercentual2, split2);

    expect(group.total_balance).toEqual(70);
  });

  it("should update differential balances correctly after adding an expense", () => {
    const groupName = "Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Lunch";
    const amount = 100;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = false;
    const split = {
      "Alice": 60,
      "Bob": 40
    };

    memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);

    expect(group.differentialBalances["Alice"]["Bob"]).toBe(40);
    expect(group.differentialBalances["Bob"]["Alice"]).toBe(-40);
  });

  it("should update differential balances correctly after adding an expense in percentages", () => {
    const groupName = "Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = createGroup.execute(groupName, members);

    const title = "Lunch";
    const amount = 20;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 80,
      "Bob": 20
    };

    memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);

    expect(group.differentialBalances["Alice"]["Bob"]).toBe(4);
    expect(group.differentialBalances["Bob"]["Alice"]).toBe(-4);
  });

  // Testar quando o cara que paga nao esta envolvido no split
  // Fazer o update do negocio diferencial varias vezes, adicionando despesas, novas pessoas, deletando pessoas

});