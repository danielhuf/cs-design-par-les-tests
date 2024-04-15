export class GroupNotFoundError extends Error {
    constructor() {
        super("Group not found");
        this.name = 'GroupNotFoundError';
    }
}

export class MemberNotFoundError extends Error {
    constructor() {
        super("Member not found");
        this.name = 'MemberNotFoundError';
    }
}

export class EmptyGroupError extends Error {
    constructor() {
        super("Group name cannot be empty");
        this.name = 'EmptyGroupError';
    }
}