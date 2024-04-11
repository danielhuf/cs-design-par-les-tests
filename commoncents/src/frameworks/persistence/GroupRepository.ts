import { Group } from "../../entities/Group";
import { IGroupRepository } from "../../interfaces/repositories/IGroupRepository";
import { mockDatabase } from "./mockDatabase";

export class GroupRepository implements IGroupRepository {
    addGroup(group: Group): void {
        mockDatabase.groups.set(group.id, group);
    }

    deleteGroup(groupId: string): boolean {
        if (!mockDatabase.groups.has(groupId)) {
            return false;
        }
        mockDatabase.groups.delete(groupId);
        return true;
    }

    findGroup(groupId: string): Group | undefined {
        return mockDatabase.groups.get(groupId);
    }
}
