import { IGroupRepository } from "../interfaces/repositories/IGroupRepository";

export class DeleteMemberFromGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(groupId: string, memberName: string): void {
        const group = this.repository.findGroup(groupId);
        if (!group) {
            throw new Error("Group not found");
        }
        const memberIndex = group.members.findIndex(member => member.name === memberName);
        if (memberIndex === -1) {
            throw new Error("Member not found");
        }
        group.members.splice(memberIndex, 1);
    }
}