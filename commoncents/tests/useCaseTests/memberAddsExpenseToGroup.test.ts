import { MemberAddsExpenseToGroup } from "../../src/usecases/MemberAddsExpenseToGroup";
import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";

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
  });

    it("should add an expense to a group", () => {
      // Arrange
      const groupName = "Holiday Trip";
      const members = ["Alice", "Bob"];
      const group = createGroup.execute(groupName, members);
      addMemberToGroup = new AddMemberToGroup(groupRepository);
      addMemberToGroup.execute(group.id, "Alice");
      addMemberToGroup.execute(group.id, "Bob");

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
});