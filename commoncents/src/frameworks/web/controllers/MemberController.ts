import { Request, Response } from "express";
import { AddMemberToGroup } from "../../../usecases/AddMemberToGroup";
import { DeleteMemberFromGroup } from "../../../usecases/DeleteMemberFromGroup";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";


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
      await this.addMemberToGroupUseCase.execute(id, name);
      res.status(200).json({ success: true });
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        res.status(404).json({ message: "Group not found" });
      }
    }
  }

  public async deleteMemberFromGroup(req: Request, res: Response): Promise<void> {
    const { id, member } = req.params;
    this.deleteMemberFromGroupUseCase.execute(id, member);
    res.status(200).json({ message: `Successfully deleted ${member} from group` });
  }
}