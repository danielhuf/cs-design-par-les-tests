import { mockDatabase, resetMockDatabase } from "../../src/frameworks/persistence/mockDatabase";
import { Group } from "../../src/domain/entities/Group";
import { Member } from "../../src/domain/entities/Member";

describe("mockDatabase", () => {
    beforeEach(() => {
        resetMockDatabase(); 
    });

    it("should initialize with no groups", () => {
        expect(mockDatabase.groups.size).toBe(0);
    });

    it("should hold a group after adding one", () => {
        const group = new Group("1", "Gaming Club", [new Member("Bob")]);
        mockDatabase.groups.set(group.id, group);
        expect(mockDatabase.groups.has("1")).toBe(true);
        expect(mockDatabase.groups.get("1")).toEqual(group);
    });

    it("should clear all groups on reset", () => {
        const group = new Group("1", "Gaming Club", [new Member("Bob")]);
        mockDatabase.groups.set(group.id, group);
        resetMockDatabase();
        expect(mockDatabase.groups.size).toBe(0);
    });
});
