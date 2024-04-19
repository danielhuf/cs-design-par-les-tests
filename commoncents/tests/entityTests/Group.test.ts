import { Group } from '../../src/domain/entities/Group';
import { Member } from '../../src/domain/entities/Member';

describe("Group Entity", () => {
    let group: Group;

    beforeEach(() => {
        group = new Group("1", "Holiday Group");
    });

    it("should add new member", () => {
        const member = new Member("Alice");
        group.addMember(member);
        expect(group.members).toContain(member);
    });
});