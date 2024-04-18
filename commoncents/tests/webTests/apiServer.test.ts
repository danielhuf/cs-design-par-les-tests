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
        } as any;
    });


    it('should route POST /group to the createGroup method of GroupController', async () => {
        // Arrange
        apiServer = new ApiServer(mockGroupController, mockMemberController);
        mockGroupController.createGroup.mockImplementation(async (req, res) => {
            res.status(201).send({
                id: "group-id",
                name: "New Group",
                members: ['Alice', 'Bob']
            });
        });

        // Act
        const response = await request(apiServer.getApp())
            .post(RoutePaths.createGroup)
            .send({ name: 'New Group', members: ['Alice', 'Bob'] });

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: "group-id",
            name: "New Group",
            members: ['Alice', 'Bob']
        });
        expect(mockGroupController.createGroup).toHaveBeenCalled();
    });

    it('should route DELETE /group to the deleteGroup method of GroupController', async () => {
        // Arrange
        apiServer = new ApiServer(mockGroupController, mockMemberController);
        mockGroupController.deleteGroup.mockImplementation(async (req, res) => {
         res.status(200).send({ success: true });
        });

        // Act
        const response = await request(apiServer.getApp())
            .delete(RoutePaths.deleteGroup)
            .send({ id: '123' });

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
        expect(mockGroupController.deleteGroup).toHaveBeenCalled();
    });

    it('should route POST /group/:id/member to the addMember method of MemberController', async () => {
        // Arrange
        apiServer = new ApiServer(mockGroupController, mockMemberController);
        mockMemberController.addMemberToGroup.mockImplementation(async (req, res) => {
            res.status(201).send({ success: true });
        });

        // Act
        const response = await request(apiServer.getApp())
            .post(RoutePaths.addMember)
            .send({ name: 'Alice' });

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ success: true });
        expect(mockMemberController.addMemberToGroup).toHaveBeenCalled();
    });
});
