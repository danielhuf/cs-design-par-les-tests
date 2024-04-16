import { Member } from '../../src/domain/entities/Member';

describe('Member', () => {
    it('should create a member with a name', () => {
        const memberName = "John Doe";
        const member = new Member(memberName);
        expect(member.name).toBe(memberName);
    });
});
