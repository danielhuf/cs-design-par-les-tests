import { IGroupController } from "../../../interfaces/controllers/IGroupController";
import { Request, Response } from "express";
import { CreateGroup } from "../../../usecases/CreateGroup";
import { Member } from "../../../domain/entities/Member";
import { Group } from "../../../domain/entities/Group";

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
        let group: Group;
        if (!members) {
            group = this.createGroupUseCase.execute(name);
        } else {
            const membersList = await this.createMembers(members);
            group = this.createGroupUseCase.execute(name, membersList);
        }
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
