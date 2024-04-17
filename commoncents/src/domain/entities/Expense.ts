import { Member } from "./Member";

export class Expense {

    title: string;
    amount: number;
    payerName: string;
    date: Date;
    isEquallySplit?: boolean;
    isPercentual?: boolean;
    split: { [key: string]: number };

    constructor(title: string, amount: number, payerName: string, date: Date, isPercentual: boolean, split: { [key: string]: number }, isEquallySplit?: boolean, membersSplit?: Member[]) {
        this.title = title;
        this.amount = amount;
        this.payerName = payerName;
        this.date = date;
        let splitTemp = {} as { [key: string]: number };
        this.isPercentual = isPercentual;
        if(Object.keys(split).length !== 0){
            splitTemp = split;
        }
        else if(membersSplit && isEquallySplit){
            this.isEquallySplit = isEquallySplit;
            splitTemp = this.calculateEqualSplit(membersSplit);
        }
        this.split = splitTemp;
    }

    private calculateEqualSplit(members: Member[]): { [key: string]: number } {
        const splitAmount = Number((this.amount / members.length).toFixed(2));
        const split = {} as { [key: string]: number };
        members.forEach((member) => {
            split[member.name] = splitAmount;
        });
        return split;
    }

}