import { CreateGroup } from "../../src/usecases/CreateGroup";

describe("Create Group Use Case", () => {
    it("should create a group with a name and initial members", () => {
        const createGroup = new CreateGroup();
        const groupName = "Holiday Trip";
        const members = ["Alice", "Bob"];
        const group = createGroup.execute(groupName, members);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual(members);
    });

    it("should create a group with a name and no initial members", () => {
        const createGroup = new CreateGroup();
        const groupName = "Holiday Trip";
        const group = createGroup.execute(groupName);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual([]);
    });

    it("should not create a group with an empty name", () => {
        const createGroup = new CreateGroup();
        const groupName = "";
        const members = ["Alice", "Bob"];

        expect(() => createGroup.execute(groupName, members)).toThrowError();
    });
});