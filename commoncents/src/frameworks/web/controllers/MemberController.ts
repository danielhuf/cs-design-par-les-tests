import { Request, Response } from "express";
import { AddMemberToGroup } from "../../../usecases/AddMemberToGroup";

export class MemberController {
  private addMemberToGroupUseCase: AddMemberToGroup;

  constructor(addMemberToGroupUseCase: AddMemberToGroup) {
    this.addMemberToGroupUseCase = addMemberToGroupUseCase;
  }

  public async addMemberToGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;
    await this.addMemberToGroupUseCase.execute(id, name);
    res.status(200).json({ success: true });
  }
}