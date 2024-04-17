import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { MemberController } from "../../src/frameworks/web/controllers/MemberController";
import { Group } from "../../src/domain/entities/Group";
import { IGroupRepository } from "../../src/interfaces/repositories/IGroupRepository";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";
import { DeleteMemberFromGroup } from "../../src/usecases/DeleteMemberFromGroup";
import { Member } from "../../src/domain/entities/Member";

describe("MemberController", () => {
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let deleteMemberFromGroupUseCase: DeleteMemberFromGroup;
  let memberController: MemberController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
      mockGroupRepository = {
          addGroup: jest.fn(),
          deleteGroup: jest.fn(),
          findGroup: jest.fn(),
      };
      deleteMemberFromGroupUseCase = new DeleteMemberFromGroup(mockGroupRepository);
      memberController = new MemberController(new AddMemberToGroup(mockGroupRepository), deleteMemberFromGroupUseCase);
      req = getMockReq({ params: { id: '123' } });
      res = getMockRes().res;
  });

  it("should successfully delete a member from a group and return the appropriate response", async () => {
      
      const memberName = "Alice";
      const group = new Group("123", "Test Group", [new Member(memberName)]);
      req.params.member = memberName;
      mockGroupRepository.findGroup.mockReturnValueOnce(group);

      await memberController.deleteMemberFromGroup(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: `Successfully deleted ${memberName} from group` });
  });

    it("should return a 404 status code if the group does not exist", async () => {
        const memberName = "Alice";
        req.params.member = memberName;
        mockGroupRepository.findGroup.mockReturnValueOnce(undefined);
    
        await memberController.deleteMemberFromGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Group not found" });
    });

    it("should return a 404 status code if the member does not belong to the group", async () => {
        const memberName = "Alice";
        const group = new Group("123", "Test Group", [new Member("Bob")]);
        req.params.member = memberName;
        mockGroupRepository.findGroup.mockReturnValueOnce(group);
    
        await memberController.deleteMemberFromGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: "Member not found" });
    });

    it("should return a 400 status code if the member name is not provided", async () => {    
        await memberController.deleteMemberFromGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Member name is required" });
    });

    it("should return a 400 status code if the group id is not provided", async () => {
        req = getMockReq({ params: { member: "Alice"} });
    
        await memberController.deleteMemberFromGroup(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: "Group id is required" });
    });
});
