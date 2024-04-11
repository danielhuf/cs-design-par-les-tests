import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { CreateGroup } from "../../src/usecases/CreateGroup";

const groupRepository = new GroupRepository();

describe("Create Group Use Case", () => {
    it("should create a group with a name and initial members", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "Holiday Trip";
        const members = ["Alice", "Bob"];
        const group = createGroup.execute(groupName, members);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual(members);
    });

    it("should create a group with a name and no initial members", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "Holiday Trip";
        const group = createGroup.execute(groupName);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual([]);
    });

    it("should not create a group with an empty name", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "";
        const members = ["Alice", "Bob"];

        expect(() => createGroup.execute(groupName, members)).toThrow("Group name cannot be empty");
    });

    it("should not create a group with a name that only contains whitespace", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "  ";
        const members = ["Alice", "Bob"];

        expect(() => createGroup.execute(groupName, members)).toThrow("Group name cannot be empty");
    });

    it("should not create a group with a member that has an empty name", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "Holiday Trip";
        const members = ["Alice", ""];

        expect(() => createGroup.execute(groupName, members)).toThrow("Member name cannot be empty");
    });

    it("should not create a group with a member that only contains whitespace", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "Holiday Trip";
        const members = ["Alice", "  "];

        expect(() => createGroup.execute(groupName, members)).toThrow("Member name cannot be empty");
    });

    it("should not create a group with members that have the same name", () => {
        const createGroup = new CreateGroup(groupRepository);
        const groupName = "Holiday Trip";
        const members = ["Alice", "Alice"];

        expect(() => createGroup.execute(groupName, members)).toThrow("Members cannot have the same name");
    });
});