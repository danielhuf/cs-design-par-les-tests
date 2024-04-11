export class Group {
    id: string;
    name: string;
    members: string[];

    constructor(id: string, name: string, members: string[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
    }

    addMember(memberName: string): void {
        if (!memberName.trim()) {
            throw new Error("Member name cannot be empty");
        }

        if (this.members.includes(memberName)) {
            throw new Error("Member already exists in the group");
        }

        this.members.push(memberName);
    }
}