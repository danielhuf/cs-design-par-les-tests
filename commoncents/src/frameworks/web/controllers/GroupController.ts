import { IGroupController } from "../../../interfaces/controllers/IGroupController";
import { Request, Response } from "express";
import { CreateGroup } from "../../../usecases/CreateGroup";
import { Member } from "../../../domain/entities/Member";

export class GroupController implements IGroupController {
    private createGroupUseCase: CreateGroup;

    constructor(createGroupUseCase: CreateGroup) {
        this.createGroupUseCase = createGroupUseCase;
    }

    public async createGroup(req: Request, res: Response): Promise<void> {
        if (!this.validateBody(req.body)) {
            res.status(400).json({ message: "Invalid request body" });
            return;
        }
        const { name, members } = req.body;
        const membersList = await this.createMembers(members);
        const group = this.createGroupUseCase.execute(name, membersList);
        const response = {
            id: group.id,
            name: group.name,
            members: group.members.map(member => ({
                name: member.name
            }))
        };
        res.status(201).json(response);
    }

    private async createMembers(members: string[]): Promise<Member[]> {
        return members.map((memberName) => new Member(memberName));
    }

    private validateBody(body: any): boolean {
        return body && body.name;
    }
}
