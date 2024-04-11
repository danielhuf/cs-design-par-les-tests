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

        if (!memberName.trim()) {
            throw new Error("Member name cannot be empty");
        }

        if (group.members.includes(memberName)) {
            throw new Error("Member already exists in the group");
        }

        group.members.push(memberName);

        return group;
    }
}
