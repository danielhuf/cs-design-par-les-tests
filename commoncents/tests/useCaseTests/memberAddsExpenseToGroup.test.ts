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

    it("should add an expense to a group with percentuals", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };
      
      // Act
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, splitPercentages);

      // Assert
      expect(updatedGroup.expenses.length).toBe(1);
      expect(updatedGroup.expenses[0].title).toBe(title);
      expect(updatedGroup.expenses[0].amount).toBe(amount);
      expect(updatedGroup.expenses[0].payerName).toBe(payerName);
      expect(updatedGroup.expenses[0].date).toBe(date);
      expect(updatedGroup.expenses[0].splitPercentages).toEqual(splitPercentages);
    });

    it("should add two expenses to a group with percentuals", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title1 = "Dinner";
      const amount1 = 50;
      const payerName1 = "Alice";
      const date1 = new Date();
      const splitPercentages1 = {
        "Alice": 50,
        "Bob": 50
      };

      const title2 = "Lunch";
      const amount2 = 20;
      const payerName2 = "Bob";
      const date2 = new Date();
      const splitPercentages2 = {
        "Alice": 50,
        "Bob": 50
      };
      
      // Act
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, splitPercentages1);
      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, splitPercentages2);

      // Assert
      expect(updatedGroup.expenses.length).toBe(2);
      expect(updatedGroup.expenses[0].title).toBe(title1);
      expect(updatedGroup.expenses[0].amount).toBe(amount1);
      expect(updatedGroup.expenses[0].payerName).toBe(payerName1);
      expect(updatedGroup.expenses[0].date).toBe(date1);
      expect(updatedGroup.expenses[0].splitPercentages).toEqual(splitPercentages1);

      expect(updatedGroup.expenses[1].title).toBe(title2);
      expect(updatedGroup.expenses[1].amount).toBe(amount2);
      expect(updatedGroup.expenses[1].payerName).toBe(payerName2);
      expect(updatedGroup.expenses[1].date).toBe(date2);
      expect(updatedGroup.expenses[1].splitPercentages).toEqual(splitPercentages2);
    });

    it("should update the total balance when an expense is added", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title1 = "Dinner";
      const amount1 = 50;
      const payerName1 = "Alice";
      const date1 = new Date();
      const splitPercentages1 = {
        "Alice": 50,
        "Bob": 50
      };
      
      // Act
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, splitPercentages1);

      // Assert
      expect(updatedGroup.total_balance).toBe(50);
    });

    it("should add up all the expenses and update total balance", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title1 = "Dinner";
      const amount1 = 50;
      const payerName1 = "Alice";
      const date1 = new Date();
      const splitPercentages1 = {
        "Alice": 50,
        "Bob": 50
      };
      
      const title2 = "Lunch";
      const amount2 = 20;
      const payerName2 = "Bob";
      const date2 = new Date();
      const splitPercentages2 = {
        "Alice": 50,
        "Bob": 50
      };

      // Act
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title1, amount1, payerName1, date1, splitPercentages1);
      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payerName2, date2, splitPercentages2);
      // Assert
      expect(updatedGroup.total_balance).toEqual(70);
    });

    it("should throw an error when adding an expense to a non-existent group", () => {
      // Arrange
      const nonExistentGroupId = "fake-id";
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(nonExistentGroupId, title, amount, payerName, date, splitPercentages)).toThrow(GroupNotFoundError);
    });

    it("should throw an error if the title is empty", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const emptyTitle = "";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, emptyTitle, amount, payerName, date, splitPercentages)).toThrow("Expense title cannot be empty");
    });

    it("should throw an error if the amount is negative", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const negativeAmount = -50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, negativeAmount, payerName, date, splitPercentages)).toThrow("Expense amount cannot be negative");
    });

    it("should throw an error if the amount is zero", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const zeroAmount = 0;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, zeroAmount, payerName, date, splitPercentages)).toThrow("Expense amount cannot be zero");
    });

    it("should throw an error if the group has no members", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const group = createGroup.execute(groupName);

      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, splitPercentages)).toThrow("Group has no members");
    });

    it("should throw an error if the payerName is not a member of the group", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const amount = 50;
      const payerName = "Charlie";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, splitPercentages)).toThrow("Payer is not a member of the group");
    });

    it("should throw an error if the percentage split members are not members of the group", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Charlie": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, splitPercentages)).toThrow("Split members are not members of the group");
    });

    it("should throw an error if the percentage split does not add up to 100%", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 40
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, splitPercentages)).toThrow("Split percentages do not add up to 100%");
    });

    it("should throw an error if the date is in the future", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const date = new Date();
      date.setDate(date.getDate() + 1);
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };

      // Act & Assert
      expect(() => memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, splitPercentages)).toThrow("Expense date cannot be in the future");
    });
});