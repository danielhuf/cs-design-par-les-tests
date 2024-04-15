import { Group } from "../../domain/entities/Group";

export interface IGroupRepository {
    addGroup(group: Group): void;
    deleteGroup(groupId: string): boolean;
    findGroup(groupId: string): Group | undefined;
}