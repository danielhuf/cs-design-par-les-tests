import { Request, Response } from "express";
import { AddMemberToGroup } from "../../../usecases/AddMemberToGroup";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";


export class MemberController {
  private addMemberToGroupUseCase: AddMemberToGroup;

  constructor(addMemberToGroupUseCase: AddMemberToGroup) {
    this.addMemberToGroupUseCase = addMemberToGroupUseCase;
  }

  public async addMemberToGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { name } = req.body;
    try {
      await this.addMemberToGroupUseCase.execute(id, name);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        res.status(404).json({ message: "Group not found" });
      }
    }
  }
}