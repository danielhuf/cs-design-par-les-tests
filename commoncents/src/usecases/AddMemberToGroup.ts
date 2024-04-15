import { IGroupRepository } from "../interfaces/repositories/IGroupRepository";
import { Member } from "../entities/Member";
import { GroupNotFoundError } from "../errors/GroupErrors";
import { EmptyMemberError, DuplicateMemberError } from "../errors/MemberErrors";

export class AddMemberToGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(groupId: string, memberName: string): any {
        const group = this.repository.findGroup(groupId);
        if (!group) {
            throw new GroupNotFoundError();
        }
        this.validateMemberName(memberName);
        this.validateMemberIsNotAlreadyInGroup(group.members, memberName);

        const member = new Member(memberName);
        group.addMember(member);

        return group;
    }

    private validateMemberName(memberName: string): void {
        if (!memberName.trim()) {
            throw new EmptyMemberError();
        }
    }

    private validateMemberIsNotAlreadyInGroup(groupMembers: Member[], memberName: string): void {
        if (groupMembers.some(member => member.name === memberName)) {
            throw new DuplicateMemberError();
        }
    }
}
