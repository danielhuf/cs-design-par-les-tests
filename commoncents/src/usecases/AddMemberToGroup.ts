import { IGroupRepository } from "../interfaces/repositories/IGroupRepository";
import { Member } from "../domain/entities/Member";
import { GroupNotFoundError } from "../domain/errors/GroupErrors";
import { MemberValidator } from "../domain/validators/MemberValidator";

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

        MemberValidator.validateMemberName(memberName);
        MemberValidator.validateMemberIsNotAlreadyInGroup(group.members, memberName);

        const member = new Member(memberName);
        group.addMember(member);

        return group;
    }
}
