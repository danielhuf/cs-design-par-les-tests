import express, { Application } from 'express';
import { GroupController } from './controllers/GroupController';
import { MemberController } from './controllers/MemberController';
import { RoutePaths } from './routes/routeConfig';

export class ApiServer {
  private app: Application;

  constructor(groupController: GroupController, memberController: MemberController) {
    this.app = express();
    this.app.use(express.json());

    this.app.post(RoutePaths.createGroup, (req, res) => groupController.createGroup(req, res));
    this.app.delete(RoutePaths.deleteGroup, (req, res) => groupController.deleteGroup(req, res));
    this.app.post(RoutePaths.addMember, (req, res) => memberController.addMemberToGroup(req, res));
    this.app.delete(RoutePaths.deleteMember, (req, res) => memberController.deleteMemberFromGroup(req, res));
  }

  public getApp(): Application {
    return this.app;
  }

  public static run(port: number, groupController: GroupController, memberController: MemberController): void {
    const server = new ApiServer(groupController, memberController);
    server.getApp().listen(port, () => {
      console.log('Server is running on http://localhost:' + port);
    });
  }
}
