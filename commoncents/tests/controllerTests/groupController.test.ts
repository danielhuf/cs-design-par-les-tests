import { GroupController } from '../../src/frameworks/web/controllers/GroupController';
import { IGroupRepository } from '../../src/interfaces/repositories/IGroupRepository';
import { CreateGroup } from '../../src/usecases/CreateGroup';
import { Group } from '../../src/domain/entities/Group';

describe('GroupController', () => {
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
    groupController = new GroupController(mockGroupRepository);
  });

  describe('createGroup', () => {
    it('should create a group successfully with valid data', async () => {
      // Arrange
      const groupName = 'Test Group';
      const memberNames = ['Alice', 'Bob'];
      const group = new Group('1', groupName, memberNames.map(name => ({ id: 'member-id', name })));
      jest.spyOn(createGroupUseCase, 'execute').mockReturnValue(group);
      
      // Act
      const result = await groupController.createGroup(groupName, memberNames);

      // Assert
      expect(createGroupUseCase.execute).toHaveBeenCalledWith(groupName, memberNames);
      expect(result).toBe(group);
    });
  });
});
