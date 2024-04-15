import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { DeleteMemberFromGroup } from "../../src/usecases/DeleteMemberFromGroup";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/entities/Member";

describe("Delete Member from Group Use Case", () => {
    let groupRepository: GroupRepository;
    let createGroup: CreateGroup;
    let addMemberToGroup: AddMemberToGroup;
    let deleteMemberFromGroup: DeleteMemberFromGroup;

    beforeEach(() => {
        resetMockDatabase();
        groupRepository = new GroupRepository();
        createGroup = new CreateGroup(groupRepository);
        addMemberToGroup = new AddMemberToGroup(groupRepository);
        deleteMemberFromGroup = new DeleteMemberFromGroup(groupRepository);
    });

    it("should successfully remove a member from an existing group", async () => {
        const group = createGroup.execute("Book Club", [new Member("Alice"), new Member("Bob")]);
        deleteMemberFromGroup.execute(group.id, "Alice");
        expect(group.members.map(m => m.name)).not.toContain("Alice");
        expect(group.members.map(m => m.name)).toContain("Bob");
    });

    it("should successfully remove a member added post-creation", async () => {
        const group = createGroup.execute("Chess Club", []);
        addMemberToGroup.execute(group.id, "Eva");
        expect(group.members.map(m => m.name)).toContain("Eva");

        await deleteMemberFromGroup.execute(group.id, "Eva");

        expect(group.members.map(m => m.name)).not.toContain("Eva");
    });

    it("should throw an error when trying to remove a member who does not exist", () => {
        const group = createGroup.execute("Book Club", [new Member("Alice")]);
        expect(() => deleteMemberFromGroup.execute(group.id, "Charlie")).toThrow("Member not found");
    });

    it("should throw an error when trying to remove a member from a non-existent group", () => {
        const nonExistentGroupId = "fake-id";
        expect(() => deleteMemberFromGroup.execute(nonExistentGroupId, "Alice")).toThrow("Group not found");
    });
});
