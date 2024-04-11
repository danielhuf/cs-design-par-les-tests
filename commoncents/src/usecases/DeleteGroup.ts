import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 

export class DeleteGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) { 
        this.repository = repository;
    }

    execute(groupId: string): any {
        if (!this.repository.findGroup(groupId)) {
            throw new Error("Group not found");
        }

        this.repository.deleteGroup(groupId);
        return { success: true };
    }
}