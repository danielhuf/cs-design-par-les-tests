import express, { Application } from 'express';

export class ApiServer {
  private app: Application;

  constructor() {
    this.app = express();
    this.app.use(express.json());
  }

  public getApp(): Application {
    return this.app;
  }

  public static run(port: number): void {
    const server = new ApiServer();
    server.getApp().listen(port, () => {
      console.log('Server is running on http://localhost:' + port);
    });
  }
}
