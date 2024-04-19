export class SimplifiedBalanceCalculator {
    private balances: { [key: string]: { [key: string]: number } };
    constructor() {
        this.balances = {};
    }
    // use this.simplifiedBalanceCalculator.calculate(this.balances, member.name, otherMember.name);
    calculate(balances: { [key: string]: { [key: string]: number } }, memberName: string, otherMemberName: string): number {
        return balances[memberName][otherMemberName] - balances[otherMemberName][memberName];
    }
}