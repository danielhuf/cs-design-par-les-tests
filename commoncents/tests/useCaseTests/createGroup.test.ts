import { CreateGroup } from "../../src/useCases/CreateGroup";

describe("Create Group Use Case", () => {
    it("should create a group with a name and initial members", () => {
        const createGroup = new CreateGroup();
        const groupName = "Holiday Trip";
        const members = ["Alice", "Bob"];
        const group = createGroup.execute(groupName, members);

        expect(group.name).toBe(groupName);
        expect(group.members).toEqual(members);
    });
});