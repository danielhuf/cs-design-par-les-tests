import { CreateGroup } from "../../src/usecases/CreateGroup";
import { DeleteGroup } from "../../src/usecases/DeleteGroup";

describe("Delete Group Use Case", () => {
    it("should delete a group by its ID", () => {
        const createGroup = new CreateGroup();
        const groupName = "Holiday Trip";
        const members = ["Alice", "Bob"];
        const group = createGroup.execute(groupName, members);

        const deleteGroup = new DeleteGroup();
        const result = deleteGroup.execute(group.id);

        expect(result).toEqual({ success: true });
    });

    it("should not delete a group that does not exist", () => {
        const deleteGroup = new DeleteGroup();
        expect(() => deleteGroup.execute("nonexistent_id")).toThrowError("Group not found");
    });
});
