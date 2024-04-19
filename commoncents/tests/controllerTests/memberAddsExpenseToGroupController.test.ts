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
    expect(res.json).toHaveBeenCalledWith(group);
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

  it("should return 400 if no body is provided", async () => {
    req.body = undefined;

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid request" });
  });

  it("should return 400 if title is not provided", async () => {
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
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
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: title" });
  });

  it("should return 400 if amount is not provided", async () => {
    const title = "Dinner";
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
      title,
      payerName,
      date,
      isPercentual,
      split
    };

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: amount" });
  });

  it("should return 400 if payer name is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
      title,
      amount,
      date,
      isPercentual,
      split
    };

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: payerName" });
  });

  it("should return 400 if date is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
      title,
      amount,
      payerName,
      isPercentual,
      split
    };

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: date" });
  });

  it("should return 400 if isPercentual is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
      title,
      amount,
      payerName,
      date,
      split
    };

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: isPercentual" });
  });

  it("should return 400 if split is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    req.body = {
      title,
      amount,
      payerName,
      date,
      isPercentual
    };

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Missing required fields: split" }));
  });

  it("should return 400 if title and amount are not provided", async () => {
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = {
      "Alice": 50,
      "Bob": 50
    };
    req.body = {
      payerName,
      date,
      isPercentual,
      split
    };

    // Act
    await expenseController.addExpenseToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Missing required fields: title, amount" }));
  });

  it("should return 400 if split is not an object", async () => {
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const isPercentual = true;
    const split = "Alice";
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
    expect(res.json).toHaveBeenCalledWith({ error: "Expense split must be an object" });
  });
});

