export class Expense {

    title: string;
    amount: number;
    payerName: string;
    date: Date;
    splitPercentages: { [key: string]: number };

    constructor(title: string, amount: number, payerName: string, date: Date, splitPercentages: { [key: string]: number }) {
        this.title = title;
        this.amount = amount;
        this.payerName = payerName;
        this.date = date;
        this.splitPercentages = splitPercentages;
    }

}