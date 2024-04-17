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
});
