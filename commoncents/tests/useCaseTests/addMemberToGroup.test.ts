import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { AddMemberToGroup } from "../../src/usecases/AddMemberToGroup";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/entities/Member";
import { GroupNotFoundError } from "../../src/errors/GroupErrors";
import { EmptyMemberError, DuplicateMemberError } from "../../src/errors/MemberErrors";

describe("Add Member to Group Use Case", () => {
    let groupRepository: GroupRepository;
    let createGroup: CreateGroup;
    let addMemberToGroup: AddMemberToGroup;

    beforeEach(() => {
        resetMockDatabase();
        groupRepository = new GroupRepository();
        createGroup = new CreateGroup(groupRepository);
        addMemberToGroup = new AddMemberToGroup(groupRepository);
    });

    it("should successfully add a member to an existing group", async () => {
        const group = createGroup.execute("Book Club", [new Member("Alice")]);
        const newMember = "Bob";
        const updatedGroup = await addMemberToGroup.execute(group.id, newMember);

        expect(updatedGroup.members).toEqual([new Member("Alice"), new Member("Bob")]);
    });

    it("should throw an error when adding a member to a non-existent group", () => {
        const nonExistentGroupId = "fake-id";
        const newMember = "Bob";

        expect(() => addMemberToGroup.execute(nonExistentGroupId, newMember)).toThrow(GroupNotFoundError);
    });

    it("should throw an error if the member name is empty", () => {
        const group = createGroup.execute("Book Club", [new Member("Alice")]);
        const emptyMemberName = "";

        expect(() => addMemberToGroup.execute(group.id, emptyMemberName)).toThrow(EmptyMemberError);
    });

    it("should throw an error if the member already exists in the group", () => {
        const group = createGroup.execute("Book Club", [new Member("Alice")]);
        const duplicateMemberName = "Alice";

        expect(() => addMemberToGroup.execute(group.id, duplicateMemberName)).toThrow(DuplicateMemberError);
    });
});
