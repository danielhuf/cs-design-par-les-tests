import { MemberAddsExpenseToGroup } from "../../src/usecases/MemberAddsExpenseToGroup";
import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";

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

    it("should add an expense to a group", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = ["Alice", "Bob"];
      const group = createGroup.execute(groupName, members);

      const title = "Dinner";
      const amount = 50;
      const payer = "Alice";
      const date = new Date();
      const splitPercentages = {
        "Alice": 50,
        "Bob": 50
      };
      
      // Act
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title, amount, payer, date, splitPercentages);

      // Assert
      expect(updatedGroup.expenses.length).toBe(1);
      expect(updatedGroup.expenses[0].title).toBe(title);
      expect(updatedGroup.expenses[0].amount).toBe(amount);
      expect(updatedGroup.expenses[0].payer).toBe(payer);
      expect(updatedGroup.expenses[0].date).toBe(date);
      expect(updatedGroup.expenses[0].splitPercentages).toEqual(splitPercentages);
    });

    it("should add two expenses to a group", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = ["Alice", "Bob"];
      const group = createGroup.execute(groupName, members);

      const title1 = "Dinner";
      const amount1 = 50;
      const payer1 = "Alice";
      const date1 = new Date();
      const splitPercentages1 = {
        "Alice": 50,
        "Bob": 50
      };

      const title2 = "Lunch";
      const amount2 = 20;
      const payer2 = "Bob";
      const date2 = new Date();
      const splitPercentages2 = {
        "Alice": 50,
        "Bob": 50
      };
      
      // Act
      const updatedGroup = memberAddsExpenseToGroup.execute(group.id, title1, amount1, payer1, date1, splitPercentages1);
      memberAddsExpenseToGroup.execute(group.id, title2, amount2, payer2, date2, splitPercentages2);

      // Assert
      expect(updatedGroup.expenses.length).toBe(2);
      expect(updatedGroup.expenses[0].title).toBe(title1);
      expect(updatedGroup.expenses[0].amount).toBe(amount1);
      expect(updatedGroup.expenses[0].payer).toBe(payer1);
      expect(updatedGroup.expenses[0].date).toBe(date1);
      expect(updatedGroup.expenses[0].splitPercentages).toEqual(splitPercentages1);

      expect(updatedGroup.expenses[1].title).toBe(title2);
      expect(updatedGroup.expenses[1].amount).toBe(amount2);
      expect(updatedGroup.expenses[1].payer).toBe(payer2);
      expect(updatedGroup.expenses[1].date).toBe(date2);
      expect(updatedGroup.expenses[1].splitPercentages).toEqual(splitPercentages2);
    });
});