import { Group } from "../entities/Group";
import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 

export class CreateGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) {
        this.repository = repository;
    }

    execute(name: string, members: string[] = []): Group {
        if (!name.trim()) {
            throw new Error("Group name cannot be empty");
        }

        for (const member of members) {
            if (!member.trim()) {
                throw new Error("Member name cannot be empty");
            }
        }

        const uniqueMembers = new Set(members);
        if (uniqueMembers.size !== members.length) {
            throw new Error("Members cannot have the same name");
        }
        
        const id = Math.random().toString(36).substring(2, 9);
        const group = new Group(id, name, members);
        this.repository.addGroup(group);
        return group;
    }
}