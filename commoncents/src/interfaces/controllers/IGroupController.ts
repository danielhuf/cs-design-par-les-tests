import { Group } from "../../domain/entities/Group";

export interface IGroupController {
  createGroup(groupName: string, memberNames: string[]): Promise<Group>;
}