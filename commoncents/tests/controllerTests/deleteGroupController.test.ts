import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { GroupController } from "../../src/frameworks/web/controllers/GroupController";
import { DeleteGroup } from "../../src/usecases/DeleteGroup";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { Group } from "../../src/domain/entities/Group";
import { IGroupRepository } from "../../src/interfaces/repositories/IGroupRepository";

describe("GroupController", () => {
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let deleteGroup: DeleteGroup;
  let createGroup: CreateGroup;
  let groupController: GroupController;
  let req: Request;
  let res: Response;

  beforeEach(() => {
      mockGroupRepository = {
          addGroup: jest.fn(),
          deleteGroup: jest.fn(),
          findGroup: jest.fn(),
      };
      deleteGroup = new DeleteGroup(mockGroupRepository);
      createGroup = new CreateGroup(mockGroupRepository);
      groupController = new GroupController(createGroup, deleteGroup);
      req = getMockReq({ params: { id: '123' } });
      res = getMockRes().res;
  });

  it("should delete a group successfully and return 200", async () => {
      mockGroupRepository.deleteGroup.mockReturnValue(true);
      mockGroupRepository.findGroup.mockReturnValue(new Group('123', 'testGroup', []));
      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
  });

});
