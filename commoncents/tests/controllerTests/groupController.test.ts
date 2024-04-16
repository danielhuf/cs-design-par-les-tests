import { GroupController } from "../../src/frameworks/web/controllers/GroupController";
import { IGroupRepository } from "../../src/interfaces/repositories/IGroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { Member } from "../../src/domain/entities/Member";

describe("GroupController", () => {
  let mockGroupRepository: IGroupRepository;
  let groupController: GroupController;
  let createGroupUseCase: CreateGroup;

  beforeEach(() => {
    mockGroupRepository = {
      addGroup: jest.fn(),
      deleteGroup: jest.fn(),
      findGroup: jest.fn()
    };
    createGroupUseCase = new CreateGroup(mockGroupRepository);
    groupController = new GroupController(createGroupUseCase);
  });

  describe("createGroup", () => {
    it("should create a group successfully with a name and initial members", async () => {
      // Arrange
      const memberNames = ["Alice", "Bob"];
      const groupName = "Holiday Trip";
      const members = [new Member("Alice"), new Member("Bob")];
      const group = createGroupUseCase.execute(groupName, members);      
      jest.spyOn(createGroupUseCase, "execute").mockReturnValue(group);
      
      // Act
      const result = await groupController.createGroup(groupName, memberNames);

      // Assert
      expect(createGroupUseCase.execute).toHaveBeenCalledWith(groupName, members);
      expect(result).toBe(group);
    });
  });
});
