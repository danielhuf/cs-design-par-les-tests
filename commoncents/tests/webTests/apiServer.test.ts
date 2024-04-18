import request from 'supertest';
import { ApiServer } from '../../src/frameworks/web/ApiServer';
import { GroupController } from '../../src/frameworks/web/controllers/GroupController';
import { MemberController } from '../../src/frameworks/web/controllers/MemberController';
import { RoutePaths } from '../../src/frameworks/web/routes/routeConfig';

describe('API Server Tests', () => {
  let apiServer: ApiServer;
  let mockGroupController: jest.Mocked<GroupController>;
  let mockMemberController: jest.Mocked<MemberController>;

  beforeEach(() => {
    mockGroupController = {
      createGroup: jest.fn(),
      deleteGroup: jest.fn(),
    } as any;

    mockMemberController = {
      addMemberToGroup: jest.fn(),
      deleteMemberFromGroup: jest.fn(),
    } as any;
  });

  it('should route POST /group to the createGroup method of GroupController', async () => {
    // Arrange
    apiServer = new ApiServer(mockGroupController, mockMemberController);
    mockGroupController.createGroup.mockImplementation(async (req, res) => {
      res.status(201).send({ message: 'Group created' });
    });

    // Act
    const response = await request(apiServer.getApp())
      .post(RoutePaths.createGroup)
      .send({ name: 'New Group', members: ['Alice', 'Bob'] });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Group created' });
    expect(mockGroupController.createGroup).toHaveBeenCalled();
  });

});
