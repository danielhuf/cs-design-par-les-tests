import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { MemberController } from "../../src/frameworks/web/controllers/MemberController";
import { Group } from "../../src/domain/entities/Group";
import { IGroupRepository } from "../../src/interfaces/repositories/IGroupRepository";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";

describe("MemberController", () => {
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let addMemberToGroup: AddMemberToGroup;
  let memberController: MemberController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
      mockGroupRepository = {
          addGroup: jest.fn(),
          deleteGroup: jest.fn(),
          findGroup: jest.fn(),
      };
      addMemberToGroup = new AddMemberToGroup(mockGroupRepository);
      memberController = new MemberController(addMemberToGroup);
      req = getMockReq({ params: { id: '123' } });
      res = getMockRes().res;
  });

  it("should successfully add a member to an existing group and return the appropriate response", async () => {
      // Arrange
      req.body = { name: "Alice" };
      const group = new Group("123", "Adventure Club", []);
      mockGroupRepository.findGroup.mockReturnValue(group);
      
      // Act
      await memberController.addMemberToGroup(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});
