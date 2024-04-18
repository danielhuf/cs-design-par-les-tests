import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { ExpenseController } from "../../src/frameworks/web/controllers/ExpenseController";
import { MemberAddsExpenseToGroup } from "../../src/usecases/MemberAddsExpenseToGroup";
import { Group } from "../../src/domain/entities/Group";
import { Member } from "../../src/domain/entities/Member";

describe("ExpenseController", () => {
  let mockAddExpenseToGroup: jest.Mocked<MemberAddsExpenseToGroup>;
  let expenseController: ExpenseController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockAddExpenseToGroup = {
      execute: jest.fn(),
    } as any;

    expenseController = new ExpenseController(mockAddExpenseToGroup);
    req = getMockReq({ params: { id: '123' } });
    res = getMockRes().res;
  });

  it("should successfully add an expense to an existing group and return the appropriate response", async () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = new Group(groupName, groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
      title,
      amount,
      payerName,
      date,
      isPercentual,
      split
    };
    mockAddExpenseToGroup.execute.mockReturnValue(group);

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(mockAddExpenseToGroup.execute).toHaveBeenCalledWith("123", title, amount, payerName, date, isPercentual, split);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});

