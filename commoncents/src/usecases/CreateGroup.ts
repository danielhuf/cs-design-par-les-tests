import { Group } from "../entities/Group";

export class CreateGroup {
    execute(name: string, members: string[] = []): Group {
        if (!name.trim()) {
            throw new Error("Group name cannot be empty");
        }

        for (const member of members) {
            if (!member.trim()) {
                throw new Error("Member name cannot be empty");
            }
        }
        
        return new Group(name, members);
    }
}