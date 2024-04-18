import express, { Application } from 'express';
import { GroupController } from './controllers/GroupController';
import { RoutePaths } from './routes/routeConfig';

export class ApiServer {
  private app: Application;

  constructor(groupController: GroupController) {
    this.app = express();
    this.app.use(express.json());
    this.app.post(RoutePaths.createGroup, groupController.createGroup);
    this.app.delete(RoutePaths.deleteGroup, groupController.deleteGroup);
  }

  public getApp(): Application {
    return this.app;
  }

  public static run(port: number, groupController: GroupController): void {
    const server = new ApiServer(groupController);
    server.getApp().listen(port, () => {
      console.log('Server is running on http://localhost:' + port);
    });
  }
}