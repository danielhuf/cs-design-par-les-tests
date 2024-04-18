import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { ExpenseController } from "../../src/frameworks/web/controllers/ExpenseController";
import { MemberAddsExpenseToGroup } from "../../src/usecases/MemberAddsExpenseToGroup";
import { Group } from "../../src/domain/entities/Group";
import { Member } from "../../src/domain/entities/Member";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";

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

  it("should return an error response if the group does not exist", async () => {
    req.params = { id: '456' };
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
    mockAddExpenseToGroup.execute.mockImplementation(() => {
      throw new GroupNotFoundError();
    });

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(mockAddExpenseToGroup.execute).toHaveBeenCalledWith("456", title, amount, payerName, date, isPercentual, split);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Group not found" });
  });

  it("should return an error response if the use case fails", async () => {
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
    mockAddExpenseToGroup.execute.mockImplementation(() => {
      throw new Error("Error message");
    });

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(mockAddExpenseToGroup.execute).toHaveBeenCalledWith("123", title, amount, payerName, date, isPercentual, split);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error message" });
  });

  it("should return 400 if group id is not provided", async () => {
    req.params = {};
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

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Group id is required" });
  });
});

