export class Group {
    id: string;
    name: string;
    members: string[];

    constructor(id:string, name: string, members: string[] = []) {
        this.id = id;
        this.name = name;
        this.members = members;
    }
}