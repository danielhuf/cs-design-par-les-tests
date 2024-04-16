import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { GroupController } from "../../src/frameworks/web/controllers/GroupController";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { IGroupRepository } from "../../src/interfaces/repositories/IGroupRepository";

describe("GroupController", () => {
  let createGroupUseCase: CreateGroup;
  let groupController: GroupController;
  let mockReq: Request;
  let mockRes: Response;
  let clearMockRes: () => void;

  beforeEach(() => {
    const mockGroupRepository: jest.Mocked<IGroupRepository> = {
      addGroup: jest.fn(),
      deleteGroup: jest.fn().mockReturnValue(true),
      findGroup: jest.fn().mockReturnValue(undefined),
    };

    createGroupUseCase = new CreateGroup(mockGroupRepository);
    groupController = new GroupController(createGroupUseCase);
    mockReq = getMockReq();
    let { res, mockClear } = getMockRes();
    mockRes = res;
    clearMockRes = mockClear;
  });

  afterEach(() => {
    clearMockRes();
  });

  it("createGroup should successfully create a group with members and return the appropriate response", async () => {
    // Arrange
    mockReq.body = { name: "Adventure Club", members: ["Alice", "Bob"] };
    
    const expectedResponse = {
      id: "1",
      name: "Adventure Club",
      members: [{ name: "Alice" }, { name: "Bob" }]
    };

    jest.spyOn(createGroupUseCase, "execute").mockReturnValue({
      id: "1",
      name: "Adventure Club",
      members: [{ name: "Alice" }, { name: "Bob" }],
      expenses: [],
      total_balance: 0,
      calculateTotalBalance: jest.fn(),
      addMember: jest.fn(),
      addExpense: jest.fn(),
    });

    // Act
    await groupController.createGroup(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
  });

  it("createGroup should return 400 if the request body is empty", async () => {
    // Arrange
    mockReq.body = {};

    // Act
    await groupController.createGroup(mockReq, mockRes);

    // Assert
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid request body" });
  });
});
