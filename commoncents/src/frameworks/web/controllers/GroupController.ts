import { Request, Response } from "express";
import { CreateGroup } from "../../../usecases/CreateGroup";
import { DeleteGroup } from "../../../usecases/DeleteGroup";
import { Member } from "../../../domain/entities/Member";
import { Group } from "../../../domain/entities/Group";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";
export class GroupController {
    private createGroupUseCase: CreateGroup;
    private deleteGroupUseCase: DeleteGroup;

    constructor(createGroupUseCase: CreateGroup, deleteGroupUseCase: DeleteGroup) {
        this.createGroupUseCase = createGroupUseCase;
        this.deleteGroupUseCase = deleteGroupUseCase;
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
        if (!body) return false;
        if (!body.name || typeof body.name !== "string") return false;
        if (body.members && !Array.isArray(body.members)) return false;
        if (body.members && body.members.some((member: any) => typeof member !== "string")) return false;
        return true;
    }

    public async deleteGroup(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "Group id is required" });
            return;
        }
        try {
            this.deleteGroupUseCase.execute(id);
            res.status(200).json({ success: true });
        } catch (error) {
            if (error instanceof GroupNotFoundError) {
                res.status(404).json({ message: "Group not found" });
            }
        }
    }
}
