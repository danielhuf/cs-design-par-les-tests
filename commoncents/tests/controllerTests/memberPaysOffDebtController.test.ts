import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { Group } from "../../src/domain/entities/Group";
import { Member } from "../../src/domain/entities/Member";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";
import { MemberPaysOffDebt } from "../../src/usecases/PayOffDebt";
import { PayOffController } from "../../src/frameworks/web/controllers/PayOffController";

describe("PayOffController", () => {
  let mockAddPayOffToGroup: jest.Mocked<MemberPaysOffDebt>;
  let payOffController: PayOffController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    mockAddPayOffToGroup = {
      execute: jest.fn(),
    } as any;

    payOffController = new PayOffController(mockAddPayOffToGroup);
    req = getMockReq({ params: { id: '123' } });
    res = getMockRes().res;
  });

  it("should successfully add a pay off to an existing group and return the appropriate response", async () => {
    const groupName = "Holiday Trip";
    const members = [new Member("Alice"), new Member("Bob")];
    const group = new Group(groupName, groupName, members);

    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      title,
      amount,
      payerName,
      date,
      payTo
    };
    mockAddPayOffToGroup.execute.mockReturnValue(group);

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(mockAddPayOffToGroup.execute).toHaveBeenCalledWith("123", title, amount, payerName, date, payTo);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(group);
  });

  it("should return an error response if the group does not exist", async () => {
    req.params = { id: '456' };
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      title,
      amount,
      payerName,
      date,
      payTo
    };
    mockAddPayOffToGroup.execute.mockImplementation(() => {
      throw new GroupNotFoundError();
    });

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(mockAddPayOffToGroup.execute).toHaveBeenCalledWith("456", title, amount, payerName, date, payTo);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Group not found" });
  });

  it("should return an error response if the use case fails", async () => {
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      title,
      amount,
      payerName,
      date,
      payTo
    };
    mockAddPayOffToGroup.execute.mockImplementation(() => {
      throw new Error("Error message");
    });

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(mockAddPayOffToGroup.execute).toHaveBeenCalledWith("123", title, amount, payerName, date, payTo);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Error message" });
  });

  it("should return 400 if group id is not provided", async () => {
    req.params = {};
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      title,
      amount,
      payerName,
      date,
      payTo
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Group id is required" });
  });

  it("should return 400 if no body is provided", async () => {
    req.body = undefined;

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid request" });
  });

  it("should return 400 if title is not provided", async () => {
    const amount = 50;
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      amount,
      payerName,
      date,
      payTo
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: title" });
  });

  it("should return 400 if amount is not provided", async () => {
    const title = "Dinner";
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      title,
      payerName,
      date,
      payTo
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: amount" });
  });

  it("should return 400 if payer name is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      title,
      amount,
      date,
      payTo
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: payerName" });
  });

  it("should return 400 if payee name is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const date = new Date();
    const payerName = "Bob";
    req.body = {
      title,
      amount,
      date,
      payerName
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: payTo" });
  });

  it("should return 400 if date is not provided", async () => {
    const title = "Dinner";
    const amount = 50;
    const payerName = "Alice";
    const payTo = "Bob";
    req.body = {
      title,
      amount,
      payerName,
      payTo
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing required fields: date" });
  });

  it("should return 400 if title and amount are not provided", async () => {
    const payerName = "Alice";
    const date = new Date();
    const payTo = "Bob";
    req.body = {
      payerName,
      date,
      payTo
    };

    // Act
    await payOffController.addPayOffToGroup(req, res);

    // Assert
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: "Missing required fields: title, amount" }));
  });
});

