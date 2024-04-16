export class Expense {

    title: string;
    amount: number;
    payerName: string;
    date: Date;
    splitPercentages: { [key: string]: number };

    constructor(title: string, amount: number, payerName: string, date: Date, divideEqually?: boolean, splitPercentages?: { [key: string]: number }) {
        this.title = title;
        this.amount = amount;
        this.payerName = payerName;
        this.date = date;

        if (divideEqually && splitPercentages) {
            throw new Error("Both dividedEqually and splitPercentages cannot be provided simultaneously.");
        }

        if (divideEqually) {
            this.calculateEqualSplit();
        } else if (splitPercentages) {
            this.splitPercentages = splitPercentages;
        } else {
            throw new Error("Either dividedEqually or splitPercentages must be provided.");
        }
    }

    private calculateEqualSplit(): void {
        this.splitPercentages = {};
        this.splitPercentages[this.payerName] = 100;
    }

}