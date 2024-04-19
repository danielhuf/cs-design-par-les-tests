import { GroupRepository } from "../../src/frameworks/persistence/GroupRepository";
import { Group } from "../../src/domain/entities/Group";
import { Member } from "../../src/domain/entities/Member";
import { resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";

describe("GroupRepository", () => {
    let groupRepository: GroupRepository;

    beforeEach(() => {
        resetMockDatabase();
        groupRepository = new GroupRepository();
    });

    it("should add a group and retrieve it", () => {
        const group = new Group("1", "Book Club", [new Member("Alice")]);
        groupRepository.addGroup(group);
        const retrievedGroup = groupRepository.findGroup("1");
        expect(retrievedGroup).toEqual(group);
    });

    it("should return undefined for a non-existent group", () => {
        const group = groupRepository.findGroup("non-existent-id");
        expect(group).toBeUndefined();
    });

    it("should delete a group and ensure it's removed", () => {
        const group = new Group("1", "Book Club", [new Member("Alice")]);
        groupRepository.addGroup(group);
        const deleteSuccess = groupRepository.deleteGroup("1");
        expect(deleteSuccess).toBe(true);
        expect(groupRepository.findGroup("1")).toBeUndefined();
    });

    it("should return false when trying to delete a non-existent group", () => {
        const deleteSuccess = groupRepository.deleteGroup("non-existent-id");
        expect(deleteSuccess).toBe(false);
    });
});
