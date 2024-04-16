import { Request, Response } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express"
import { GroupController } from "../../src/frameworks/web/controllers/GroupController";
import { DeleteGroup } from "../../src/usecases/DeleteGroup";
import { IGroupRepository } from "../../src/interfaces/repositories/IGroupRepository";

describe("GroupController", () => {
  let mockGroupRepository: jest.Mocked<IGroupRepository>;
  let deleteGroup: DeleteGroup;
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
      groupController = new GroupController(null, deleteGroup);
      req = getMockReq({ params: { id: '123' } });
      res = getMockRes().res;
  });

  it("should delete a group successfully and return 200", async () => {
      mockGroupRepository.deleteGroup.mockReturnValue(true);

      await groupController.deleteGroup(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
  });

});
