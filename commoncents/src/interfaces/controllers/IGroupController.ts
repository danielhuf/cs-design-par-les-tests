import { Request, Response } from "express";
export interface IGroupController {
    createGroup(req: Request, res: Response): Promise<void>;
}