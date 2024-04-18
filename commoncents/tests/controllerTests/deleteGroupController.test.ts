import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { GroupController } from "../../src/frameworks/web/controllers/GroupController";
import { DeleteGroup } from "../../src/usecases/DeleteGroup";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { GroupNotFoundError } from "../../src/domain/errors/GroupErrors";

describe("GroupController", () => {
    let mockCreateGroup: jest.Mocked<CreateGroup>;
    let mockDeleteGroup: jest.Mocked<DeleteGroup>;
    let groupController: GroupController;
    let req: Request;
    let res: Response;

    beforeEach(() => {
        mockCreateGroup = {
            execute: jest.fn(),
        } as any; // as any to avoid having to mock all methods of CreateGroup

        mockDeleteGroup = {
            execute: jest.fn(),
        } as any;
        groupController = new GroupController(mockCreateGroup, mockDeleteGroup);
        req = getMockReq({ params: { id: '123' } });
        res = getMockRes().res;
    });

    it("should delete a group successfully and return 200", async () => {
        mockDeleteGroup.execute.mockReturnValue(true);

        await groupController.deleteGroup(req, res);

        expect(mockDeleteGroup.execute).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it("should return 404 if group is not found", async () => {
        mockDeleteGroup.execute.mockImplementation(() => {
            throw new GroupNotFoundError();
        });

        await groupController.deleteGroup(req, res);

        expect(mockDeleteGroup.execute).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Group not found" });
    });

    it("should return 400 if group id is not provided", async () => {
        req = getMockReq();

        await groupController.deleteGroup(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Group id is required" });
    });

});
