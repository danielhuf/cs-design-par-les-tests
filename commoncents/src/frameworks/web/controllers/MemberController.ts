import { Request, Response } from "express";
import { AddMemberToGroup } from "../../../usecases/AddMemberToGroup";
import { DeleteMemberFromGroup } from "../../../usecases/DeleteMemberFromGroup";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";
import { MemberNotFoundError } from "../../../domain/errors/GroupErrors";

export class MemberController {
  private addMemberToGroupUseCase: AddMemberToGroup;
  private deleteMemberFromGroupUseCase: DeleteMemberFromGroup;

  constructor(addMemberToGroupUseCase: AddMemberToGroup, deleteMemberFromGroupUseCase: DeleteMemberFromGroup) {
    this.addMemberToGroupUseCase = addMemberToGroupUseCase;
    this.deleteMemberFromGroupUseCase = deleteMemberFromGroupUseCase;
  }

  public async addMemberToGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Group id is required" });
      return;
    }
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ message: "Member name is required" });
      return;
    }
    try {
      const group = await this.addMemberToGroupUseCase.execute(id, name);
      res.status(200).json(group);
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        res.status(404).json({ message: "Group not found" });
      }
    }
  }

  public async deleteMemberFromGroup(req: Request, res: Response): Promise<void> {
    const { id, name } = req.params;
    if (!id) {
      res.status(400).json({ message: "Group id is required" });
      return;
    }
    if (!name) {
      res.status(400).json({ message: "Member name is required" });
      return;
    }
    try {
      await this.deleteMemberFromGroupUseCase.execute(id, name);
      res.status(200).json({ message: `Successfully deleted ${name} from group` });
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        res.status(404).json({ message: "Group not found" });
      } else if (error instanceof MemberNotFoundError) {
        res.status(404).json({ message: "Member not found" });
      }
    }
  }
}