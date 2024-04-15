export class EmptyMemberError extends Error {
    constructor() {
        super("Member name cannot be empty");
        this.name = 'EmptyMemberError';
    }
}

export class DuplicateMemberError extends Error {
    constructor() {
        super("Member already exists in the group");
        this.name = 'DuplicateMemberError';
    }
}