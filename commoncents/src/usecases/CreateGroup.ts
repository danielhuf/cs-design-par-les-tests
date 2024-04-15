import { Group } from "../entities/Group";
import { Member } from "../entities/Member";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 
import { v4 as uuidv4 } from 'uuid';
import { EmptyGroupError } from "../errors/GroupErrors";
import { EmptyMemberError, DuplicateMemberError } from "../errors/MemberErrors";

export class CreateGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(name: string, members: Member[] = []): Group {
        this.validateGroupName(name);
        this.validateMemberNames(members);
        this.ensureUniqueMemberNames(members);

        const id = this.generateId();
        const group = new Group(id, name, members);
        this.repository.addGroup(group);
        return group;
    }

    private validateGroupName(name: string): void {
        if (!name.trim()) {
            throw new EmptyGroupError();
        }
    }

    private validateMemberNames(members: Member[]): void {
        for (const member of members) {
            if (!member.name.trim()) {
                throw new EmptyMemberError();
            }
        }
    }

    private ensureUniqueMemberNames(members: Member[]): void {
        const uniqueMembers = new Set(members.map(member => member.name));
        if (uniqueMembers.size !== members.length) {
            throw new DuplicateMemberError();
        }
    }

    private generateId(): string {
        return uuidv4(); 
    }
}