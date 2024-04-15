import { EmptyGroupError } from "../errors/GroupErrors";

export class GroupValidator {
    static validateGroupName(name: string): void {
        if (!name.trim()) {
            throw new EmptyGroupError();
        }
    }
}