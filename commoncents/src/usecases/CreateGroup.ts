import { Group } from "../domain/entities/Group";
import { Member } from "../domain/entities/Member";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 
import { v4 as uuidv4 } from 'uuid';
import { GroupValidator } from "../domain/validators/GroupValidator";
import { MemberValidator } from "../domain/validators/MemberValidator";

export class CreateGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(name: string, members: Member[] = []): Group {
        GroupValidator.validateGroupName(name);
        for (const member of members) {
            MemberValidator.validateMemberName(member.name);
        }
        MemberValidator.validateUniqueMemberNames(members);

        const id = this.generateId();
        const group = new Group(id, name, members);
        this.repository.addGroup(group);
        return group;
    }

    private generateId(): string {
        return uuidv4(); 
    }
}