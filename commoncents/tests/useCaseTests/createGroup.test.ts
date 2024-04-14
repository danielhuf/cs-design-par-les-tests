import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Member } from "../../src/entities/Member";

describe("Create Group Use Case", () => {
    let groupRepository: GroupRepository;
    let createGroup: CreateGroup;

    beforeEach(() => {
        resetMockDatabase();
        groupRepository = new GroupRepository();
        createGroup = new CreateGroup(groupRepository);
    });

    it("should create a group with a name and initial members", () => {
        const groupName = "Holiday Trip";
        const members = [new Member("Alice"), new Member("Bob")];
        const group = createGroup.execute(groupName, members);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual(members);
    });

    it("should create a group with a name and no initial members", () => {
        const groupName = "Holiday Trip";
        const group = createGroup.execute(groupName);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual([]);
    });

    it("should not create a group with an empty name", () => {
        const groupName = "";
        const members = [new Member("Alice"), new Member("Bob")]

        expect(() => createGroup.execute(groupName, members)).toThrow("Group name cannot be empty");
    });

    it("should not create a group with a name that only contains whitespace", () => {
        const groupName = "  ";
        const members = [new Member("Alice"), new Member("Bob")]

        expect(() => createGroup.execute(groupName, members)).toThrow("Group name cannot be empty");
    });

    it("should not create a group with a member that has an empty name", () => {
        const groupName = "Holiday Trip";
        const members = [new Member("Alice"), new Member("")];

        expect(() => createGroup.execute(groupName, members)).toThrow("Member name cannot be empty");
    });

    it("should not create a group with a member that only contains whitespace", () => {
        const groupName = "Holiday Trip";
        const members = [new Member("Alice"), new Member("  ")];

        expect(() => createGroup.execute(groupName, members)).toThrow("Member name cannot be empty");
    });

    it("should not create a group with members that have the same name", () => {
        const groupName = "Holiday Trip";
        const members = [new Member("Alice"), new Member("Alice")];

        expect(() => createGroup.execute(groupName, members)).toThrow("Members cannot have the same name");
    });
});