import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { MemberController } from "../../src/frameworks/web/controllers/MemberController";
import { Group } from "../../src/domain/entities/Group";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";
import { DeleteMemberFromGroup } from "../../src/usecases/DeleteMemberFromGroup";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";

describe("MemberController", () => {
    let mockAddMemberToGroup: jest.Mocked<AddMemberToGroup>;
    let mockDeleteMemberFromGroup: jest.Mocked<DeleteMemberFromGroup>;
    let memberController: MemberController;
    let req: Request;
    let res: Response;

    beforeEach(() => {
        mockAddMemberToGroup = {
            execute: jest.fn(),
        } as any; // as any to avoid having to mock all methods of AddMemberToGroup

        mockDeleteMemberFromGroup = {
            execute: jest.fn(),
        } as any;

        memberController = new MemberController(mockAddMemberToGroup, mockDeleteMemberFromGroup);
        req = getMockReq({ params: { id: '123' } });
        res = getMockRes().res;
    });

    it("should successfully add a member to an existing group and return the appropriate response", async () => {
        // Arrange
        req.body = { name: "Alice" };
        const group = new Group("123", "Adventure Club", []);
        mockAddMemberToGroup.execute.mockReturnValue(group);   

        // Act
        await memberController.addMemberToGroup(req, res);

        // Assert
        expect(mockAddMemberToGroup.execute).toHaveBeenCalledWith("123", "Alice");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return a 404 status code if the group does not exist", async () => {
        // Arrange
        req.body = { name: "Alice" };
        mockAddMemberToGroup.execute.mockImplementation(() => {
            throw new GroupNotFoundError();
        });
        
        // Act
        await memberController.addMemberToGroup(req, res);
    
        // Assert
        expect(mockAddMemberToGroup.execute).toHaveBeenCalledWith("123", "Alice");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Group not found" });
    });

    it("should return a 400 status code if the group id is not provided", async () => {
        // Arrange
        req = getMockReq();
        
        // Act
        await memberController.addMemberToGroup(req, res);
    
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Group id is required" });
    });

    it("should return a 400 status code if the request body is empty", async () => {
        // Arrange
        req.body = {};
        
        // Act
        await memberController.addMemberToGroup(req, res);
    
        // Assert
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Member name is required" });
    });
});
