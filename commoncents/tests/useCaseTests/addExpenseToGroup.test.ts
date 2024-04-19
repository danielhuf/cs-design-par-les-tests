import { MemberAddsExpenseToGroup } from "../../src/usecases/AddExpenseToGroup";
import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/domain/entities/Member";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";
import e from "express";

describe("Member Adds Expense To Group Use Case", () => {

  let groupRepository: GroupRepository;
  let createGroup: CreateGroup;
  let memberAddsExpenseToGroup: MemberAddsExpenseToGroup;
  let addMemberToGroup: AddMemberToGroup;

  beforeEach(() => {
    resetMockDatabase();
    groupRepository = new GroupRepository();
    createGroup = new CreateGroup(groupRepository);
    memberAddsExpenseToGroup = new MemberAddsExpenseToGroup(groupRepository);
    addMemberToGroup = new AddMemberToGroup(groupRepository);
  });

  describe("Expense addition", () => {
    it("should add a expense to a group with percentual split", () => {
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
  
    it("should add a expense to a group with value split", () => {
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

    it("should add an expense to a group and equally divide it", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob"), new Member("Charlie")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const isEquallySplit = true;
      const isPercentual = false;
      const membersSplit = members;
      const split = {};
      
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split, isEquallySplit, membersSplit);
      const expectedSplit = {"Alice": 16.67, "Bob": 16.67, "Charlie": 16.67};
      
      expect(updatedGroup.expenses.length).toBe(1);
      expect(updatedGroup.expenses[0].title).toBe(title);
      expect(updatedGroup.expenses[0].amount).toBe(amount);
      expect(updatedGroup.expenses[0].payerName).toBe(payerName);
      expect(updatedGroup.expenses[0].date).toBe(date);
      expect(updatedGroup.expenses[0].isPercentual).toBe(isPercentual);
      expect(updatedGroup.expenses[0].split).toEqual(expectedSplit);
      expect(updatedGroup.expenses[0].isEquallySplit).toBe(isEquallySplit);
    });
  });

  describe("Balance calculations", () => { 
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
  
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(40);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-40);
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
  
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(4);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-4);
    });

    it("should update differential balances correctly after adding multiple expenses", () => { 
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const title1 = "Lunch";
      const amount1 = 20;
      const payerName1 = "Alice";
      const date1 = new Date();
      const isPercentual1 = true;
      const split1 = {
        "Alice": 80,
        "Bob": 20
      };
  
      const title2 = "Dinner";
      const amount2 = 50;
      const payerName2 = "Bob";
      const date2 = new Date();
      const isPercentual2 = false;
      const split2 = {
        "Alice": 30,
        "Bob": 20
      };
  
      memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, isPercentual1, split1);
      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, isPercentual2, split2);
  
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(-26);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(26);
      
    });

    it("should update differential balances correctly after adding a new member to the group", () => { 
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
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(4);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-4);
  
      addMemberToGroup.execute(group.id, "Charlie");
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(4);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-4);
      expect(group.getDifferentialBalance("Alice", "Charlie")).toBe(0);
      expect(group.getDifferentialBalance("Charlie", "Alice")).toBe(0);
      expect(group.getDifferentialBalance("Bob", "Charlie")).toBe(0);
      expect(group.getDifferentialBalance("Charlie", "Bob")).toBe(0);
    });

    it("should update differential balances correctly after removing a member from the group", () => { 
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob"), new Member("Charlie")];
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
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(4);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-4);
  
      group.removeMember("Charlie");
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(4);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-4);
      expect(group.getDifferentialBalance("Alice", "Charlie")).toBeUndefined();
      expect(group.getDifferentialBalance("Bob", "Charlie")).toBeUndefined();

      group.removeMember("Bob");
      expect(group.getDifferentialBalance("Alice", "Bob")).toBeUndefined();
    });

    it("should update differential balances correctly after adding an equally split expense", () => {
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob"), new Member("Charlie")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Lunch";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const isEquallySplit = true;
      const isPercentual = false;
      const membersSplit = members;
      const split = {};
      
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split, isEquallySplit, membersSplit);
      
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(16.67);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-16.67);
      expect(group.getDifferentialBalance("Alice", "Charlie")).toBe(16.67);
      expect(group.getDifferentialBalance("Charlie", "Alice")).toBe(-16.67);
      expect(group.getDifferentialBalance("Bob", "Charlie")).toBe(0);
      expect(group.getDifferentialBalance("Charlie", "Bob")).toBe(0);
    });

    it("should update differential balances correctly after adding an equally split expense in which the payer is not involved", () => { 
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob"), new Member("Charlie")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Lunch";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const isEquallySplit = true;
      const isPercentual = false;
      const membersSplit = [members[1], members[2]];
      const split = {};
      
      memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split, isEquallySplit, membersSplit);
      
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(25);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-25);
      expect(group.getDifferentialBalance("Alice", "Charlie")).toBe(25);
      expect(group.getDifferentialBalance("Charlie", "Alice")).toBe(-25);
      expect(group.getDifferentialBalance("Bob", "Charlie")).toBe(0);
      expect(group.getDifferentialBalance("Charlie", "Bob")).toBe(0);
    });
  });

  describe("Simplified balance calculations", () => {
    it("simplified balance should be equal to diffirential balance if the group has only two members", () => {
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title1 = "Lunch";
      const amount1 = 20;
      const payerName1 = "Alice";
      const date1 = new Date();
      const isPercentual1 = true;
      const split1 = {
        "Alice": 80,
        "Bob": 20
      };

      const title2 = "Dinner";
      const amount2 = 50;
      const payerName2 = "Bob";
      const date2 = new Date();
      const isPercentual2 = false;
      const split2 = {
        "Alice": 30,
        "Bob": 20
      };

      memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, isPercentual1, split1);
      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, isPercentual2, split2);

      expect(group.getSimplifiedBalance("Alice", "Bob")).toBe(-26);
      expect(group.getSimplifiedBalance("Bob", "Alice")).toBe(26);
    });

    it("should update simplified balances correctly after adding an simplifyable expense", () => {
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob"), new Member("Charlie")];
      const group = createGroup.execute(groupName, members);

      // Bob owes Alice 30
      const title1 = "Lunch";
      const amount1 = 50;
      const payerName1 = "Alice";
      const date1 = new Date();
      const isPercentual1 = false;
      const split1 = {
        "Alice": 20,
        "Bob": 30
      };

      // Alice owes Charlie 30
      const title2 = "Dinner";
      const amount2 = 50;
      const payerName2 = "Charlie";
      const date2 = new Date();
      const isPercentual2 = false;
      const split2 = {
        "Charlie": 20,
        "Alice": 30
      };

      memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, isPercentual1, split1);
      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(30);

      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, isPercentual2, split2);
      expect(group.getDifferentialBalance("Charlie", "Alice")).toBe(30);

      expect(group.getSimplifiedBalance("Alice", "Bob")).toBe(0);
      expect(group.getSimplifiedBalance("Charlie", "Alice")).toBe(0);
      expect(group.getSimplifiedBalance("Charlie", "Bob")).toBe(30);

    });

    it("should simplify to 0 if there is a circular debt", () => {
      const groupName = "Trip";
      const members = [new Member("Alice"), new Member("Bob"), new Member("Charlie")];
      const group = createGroup.execute(groupName, members);

      // Bob owes Alice 30
      const title1 = "Lunch";
      const amount1 = 50;
      const payerName1 = "Alice";
      const date1 = new Date();
      const isPercentual1 = false;
      const split1 = {
        "Alice": 20,
        "Bob": 30
      };

      // Charlie owes Bob 30
      const title2 = "Dinner";
      const amount2 = 50;
      const payerName2 = "Bob";
      const date2 = new Date();
      const isPercentual2 = false;
      const split2 = {
        "Bob": 20,
        "Charlie": 30
      };

      // Alice owes Charlie 30
      const title3 = "Breakfast";
      const amount3 = 50;
      const payerName3 = "Charlie";
      const date3 = new Date();
      const isPercentual3 = false;
      const split3 = {
        "Charlie": 20,
        "Alice": 30
      };

      memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, isPercentual1, split1);
      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, isPercentual2, split2);
      memberAddsExpenseToGroup.execute(group.id, title3, amount3, payerName3, date3, isPercentual3, split3);

      expect(group.getSimplifiedBalance("Alice", "Bob")).toBe(0);
      expect(group.getSimplifiedBalance("Charlie", "Alice")).toBe(0);
      expect(group.getSimplifiedBalance("Charlie", "Bob")).toBe(0);
    });

  });

  describe("Error handling", () => { 
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
  });
});