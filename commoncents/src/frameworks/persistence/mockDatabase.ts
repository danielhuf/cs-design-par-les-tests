export const mockDatabase = {
    groups: new Map<string, any>()
};

export function resetMockDatabase() {
    mockDatabase.groups.clear();
}