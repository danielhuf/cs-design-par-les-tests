import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { GroupController } from "../../src/frameworks/web/controllers/GroupController";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { Group } from "../../src/domain/entities/Group";
import { Member } from "../../src/domain/entities/Member";
import { DeleteGroup } from "../../src/usecases/DeleteGroup";

describe("GroupController", () => {
    let mockCreateGroup: jest.Mocked<CreateGroup>;
    let mockDeleteGroup: jest.Mocked<DeleteGroup>;
    let groupController: GroupController;
    let mockReq: Request;
    let mockRes: Response;
    let clearMockRes: () => void;

    beforeEach(() => {

        mockCreateGroup = {
            execute: jest.fn(),
        } as any; // as any to avoid having to mock all methods of CreateGroup

        mockDeleteGroup = {
            execute: jest.fn(),
        } as any;

        groupController = new GroupController(mockCreateGroup, mockDeleteGroup);
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

        mockCreateGroup.execute.mockReturnValue(
            new Group("1", "Adventure Club", [
                new Member("Alice"),
                new Member("Bob")
            ])
        );

        // Act
        await groupController.createGroup(mockReq, mockRes);

        // Assert
        expect(mockCreateGroup.execute).toHaveBeenCalledWith("Adventure Club", [new Member("Alice"), new Member("Bob")]);
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

    it("createGroup should return 400 if the request body is missing name", async () => {
        // Arrange
        mockReq.body = { members: ["Alice", "Bob"] };

        // Act
        await groupController.createGroup(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid request body" });
    });

    it("createGroup should return 400 if the name is empty", async () => {
        // Arrange
        mockReq.body = { name: "", members: ["Alice", "Bob"] };

        // Act
        await groupController.createGroup(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid request body" });
    });

    it("createGroup should successfully create a group with no members and return the appropriate response", async () => {
        // Arrange
        mockReq.body = { name: "Adventure Club" };
        
        const expectedResponse = {
        id: "1",
        name: "Adventure Club",
        members: []
        };

        mockCreateGroup.execute.mockReturnValue(
            new Group("1", "Adventure Club", [])
        );

        // Act
        await groupController.createGroup(mockReq, mockRes);

        // Assert
        expect(mockCreateGroup.execute).toHaveBeenCalledWith("Adventure Club");
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith(expectedResponse);
    });

    it("createGroup should return 400 if members is not an array", async () => {
        // Arrange
        mockReq.body = { name: "Adventure Club", members: "Alice" };

        // Act
        await groupController.createGroup(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid request body" });
    });

    it("createGroup should return 400 if members is not an array of strings", async () => {
        // Arrange
        mockReq.body = { name: "Adventure Club", members: ["Alice",
        { name: "Bob" }] };
        
        // Act
        await groupController.createGroup(mockReq, mockRes);

        // Assert
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ message: "Invalid request body" });
    });
});
