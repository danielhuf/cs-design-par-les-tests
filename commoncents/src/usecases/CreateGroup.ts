import { Group } from "../entities/Group";

export class CreateGroup {
    execute(name: string, members: string[]): Group {
        return new Group(name, members);
    }
}