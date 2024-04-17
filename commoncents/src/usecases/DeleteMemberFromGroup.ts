import { IGroupRepository } from "../interfaces/repositories/IGroupRepository";
import { GroupNotFoundError } from "../domain/errors/GroupErrors";

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
        group.removeMember(memberName);
    }
}