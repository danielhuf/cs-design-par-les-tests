import { Member } from "../entities/Member";
import { EmptyMemberError, DuplicateMemberError } from "../errors/MemberErrors";

export class MemberValidator {
    static validateMemberName(memberName: string): void {
        if (!memberName.trim()) {
            throw new EmptyMemberError();
        }
    }

    static validateMemberIsNotAlreadyInGroup(groupMembers: Member[], memberName: string): void {
        if (groupMembers.some(member => member.name === memberName)) {
            throw new DuplicateMemberError();
        }
    }

    static validateUniqueMemberNames(members: Member[]): void {
        const uniqueMembers = new Set(members.map(member => member.name));
        if (uniqueMembers.size !== members.length) {
            throw new DuplicateMemberError();
        }
    }
}