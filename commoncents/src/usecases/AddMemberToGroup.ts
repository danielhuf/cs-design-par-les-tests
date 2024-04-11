import { IGroupRepository } from "../interfaces/repositories/IGroupRepository";

export class AddMemberToGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(groupId: string, memberName: string): any {
        const group = this.repository.findGroup(groupId);
        if (!group) {
            throw new Error("Group not found");
        }

        group.addMember(memberName);

        return group;
    }
}
