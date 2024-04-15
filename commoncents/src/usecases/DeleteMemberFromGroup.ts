import { IGroupRepository } from "../interfaces/repositories/IGroupRepository";
import { GroupNotFoundError, MemberNotFoundError } from "../errors/GroupErrors";

export class DeleteMemberFromGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(groupId: string, memberName: string): void {
        const group = this.repository.findGroup(groupId);
        if (!group) {
            throw new GroupNotFoundError();
        }
        const memberIndex = group.members.findIndex(member => member.name === memberName);
        if (memberIndex === -1) {
            throw new MemberNotFoundError();
        }
        group.members.splice(memberIndex, 1);
    }
}