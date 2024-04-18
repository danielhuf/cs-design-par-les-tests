import { MemberAddsExpenseToGroup } from "../../src/usecases/MemberAddsExpenseToGroup";
import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/domain/entities/Member";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";
import { MemberPaysOffDebt } from "../../src/usecases/MemberPaysOffDebt";
import { PayOff } from "../../src/domain/entities/PayOff";

describe("Member Pays Off Expense To Other Memeber In Group Use Case", () => {

  let groupRepository: GroupRepository;
  let createGroup: CreateGroup;
  let memberAddsExpenseToGroup: MemberAddsExpenseToGroup;
  let memberPaysOffDebt: MemberPaysOffDebt;
  let addMemberToGroup: AddMemberToGroup;

  beforeEach(() => {
    resetMockDatabase();
    groupRepository = new GroupRepository();
    createGroup = new CreateGroup(groupRepository);
    memberAddsExpenseToGroup = new MemberAddsExpenseToGroup(groupRepository);
    memberPaysOffDebt = new MemberPaysOffDebt(groupRepository);
  });

  describe("PayOff addition", () => {
    it("should create a pay off", () => {
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
      
      const payOff = new PayOff(title, amount, payerName, date, payTo);
      
      expect(payOff.title).toBe(title);
      expect(payOff.amount).toBe(amount);
      expect(payOff.payerName).toBe(payerName);
      expect(payOff.date).toBe(date);
      expect(payOff.payTo).toBe(payTo);
    });
  });

  describe("Balance calculations", () => { 
    it("should update differential balances correctly after adding a complete pay off", () => {
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

      const titlePayOff = "Lunch pay off";
      const amountPayOff = 40;
      const payerNamePayOff = "Bob";
      const payTo = "Alice";
      const datePayOff = new Date();
  
      memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);
      memberPaysOffDebt.execute(group.id, titlePayOff, payTo, amountPayOff, payerNamePayOff, datePayOff)

      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(0);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(0);
    });

    it("should update differential balances correctly after adding a partial pay off", () => {
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

      const titlePayOff = "Lunch pay off";
      const amountPayOff = 30;
      const payerNamePayOff = "Bob";
      const payTo = "Alice";
      const datePayOff = new Date();
  
      memberAddsExpenseToGroup.execute(group.id, title, amount, payerName, date, isPercentual, split);
      memberPaysOffDebt.execute(group.id, titlePayOff, payTo, amountPayOff, payerNamePayOff, datePayOff)

      expect(group.getDifferentialBalance("Alice", "Bob")).toBe(10);
      expect(group.getDifferentialBalance("Bob", "Alice")).toBe(-10);
    });
  });

  describe("Error handling", () => { 
    it("should throw an error when adding a pay off to a non-existent group", () => {
      const nonExistentGroupId = "fake-id";
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(nonExistentGroupId, title, payTo, amount, payerName, date)).toThrow(GroupNotFoundError);
    });
  
    it("should throw an error if the title is empty", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const emptyTitle = "";
      const amount = 50;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(group.id, emptyTitle, payTo, amount, payerName, date)).toThrow("Expense title cannot be empty");
    });
  
    it("should throw an error if the amount is negative", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Dinner";
      const negativeAmount = -50;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(group.id, title, payTo, negativeAmount, payerName, date)).toThrow("Expense amount cannot be negative");
    });
  
    it("should throw an error if the amount is zero", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Dinner";
      const zeroAmount = 0;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(group.id, title, payTo, zeroAmount, payerName, date)).toThrow("Expense amount cannot be zero");
    });
  
    it("should throw an error if the group has no members", () => {
      const groupName = "Holiday Trip";
      const group = createGroup.execute(groupName);
  
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(group.id, title, payTo, amount, payerName, date)).toThrow("Group has no members");
    });
  
    it("should throw an error if the payerName is not a member of the group", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Dinner";
      const amount = 50;
      const payerName = "Charlie";
      const payTo = "Bob";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(group.id, title, payTo, amount, payerName, date)).toThrow("Payer is not a member of the group");
    });
  
    it("should throw an error if the payTo is not a member of the group", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const payTo = "Charlie";
      const date = new Date();
  
      expect(() => memberPaysOffDebt.execute(group.id, title, payTo, amount, payerName, date)).toThrow("Split members are not members of the group");
    });
  
    it("should throw an error if the date is in the future", () => {
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroup.execute(groupName, members);
  
      const title = "Dinner";
      const amount = 50;
      const payerName = "Alice";
      const payTo = "Bob";
      const date = new Date();
      date.setDate(date.getDate() + 1);
  
      expect(() => memberPaysOffDebt.execute(group.id, title, payTo, amount, payerName, date)).toThrow("Expense date cannot be in the future");
    });
  });
});