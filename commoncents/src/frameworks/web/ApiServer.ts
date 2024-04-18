import express, { Application } from 'express';
import { GroupController } from './controllers/GroupController';
import { MemberController } from './controllers/MemberController';
import { RoutePaths } from './routes/routeConfig';

export class ApiServer {
  private app: Application;

  constructor(groupController: GroupController, memberController: MemberController) {
    this.app = express();
    this.app.use(express.json());
    this.app.post(RoutePaths.createGroup, groupController.createGroup);
    this.app.delete(RoutePaths.deleteGroup, groupController.deleteGroup);
    this.app.post(RoutePaths.addMember, memberController.addMemberToGroup);
    this.app.delete(RoutePaths.deleteMember, memberController.deleteMemberFromGroup);
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