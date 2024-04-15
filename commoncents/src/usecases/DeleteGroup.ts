import { IGroupRepository } from "../interfaces/repositories/IGroupRepository"; 
import { GroupNotFoundError } from "../domain/errors/GroupErrors";

export class DeleteGroup {
    private repository: IGroupRepository;

    constructor(repository: IGroupRepository) { 
        this.repository = repository;
    }

    execute(groupId: string): any {
        if (!this.repository.findGroup(groupId)) {
            throw new GroupNotFoundError();
        }

        this.repository.deleteGroup(groupId);
        return { success: true };
    }
}