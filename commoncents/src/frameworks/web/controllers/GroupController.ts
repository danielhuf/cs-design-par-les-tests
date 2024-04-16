import { IGroupController } from "../../../interfaces/controllers/IGroupController";
import { CreateGroup } from "../../../usecases/CreateGroup";
import { Group } from "../../../domain/entities/Group";
import { Member } from "../../../domain/entities/Member";

export class GroupController implements IGroupController {
    private createGroupUseCase: CreateGroup;

    constructor(createGroupUseCase: CreateGroup) {
        this.createGroupUseCase = createGroupUseCase;
    }

    public async createGroup(groupName: string, memberNames: string[]): Promise<Group> {
        const members = await this.createMembers(memberNames);
        return this.createGroupUseCase.execute(groupName, members);
    }

    private async createMembers(memberNames: string[]): Promise<Member[]> {
        return memberNames.map(name => new Member(name));
    }

}
