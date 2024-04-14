import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { DeleteGroup } from "../../src/usecases/DeleteGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/entities/Member";

describe("Delete Group Use Case", () => {
    let groupRepository: GroupRepository;
    let createGroup: CreateGroup;
    let deleteGroup: DeleteGroup;

    beforeEach(() => {
        resetMockDatabase();
        groupRepository = new GroupRepository();
        createGroup = new CreateGroup(groupRepository);
        deleteGroup = new DeleteGroup(groupRepository);
    });

    it("should delete a group by its ID", () => {
        const groupName = "Holiday Trip";
        const members = [new Member("Alice"), new Member("Bob")];
        const group = createGroup.execute(groupName, members);

        const result = deleteGroup.execute(group.id);

        expect(result).toEqual({ success: true });
    });

    it("should not delete a group that does not exist", () => {
        expect(() => deleteGroup.execute("nonexistent_id")).toThrow("Group not found");
    });
});
