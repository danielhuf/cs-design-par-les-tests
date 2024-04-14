export class Expense {

    title: string;
    amount: number;
    payer: string;
    date: Date;
    splitPercentages: { [key: string]: number };

    constructor(title: string, amount: number, payer: string, date: Date, splitPercentages: { [key: string]: number }) {
        this.title = title;
        this.amount = amount;
        this.payer = payer;
        this.date = date;
        this.splitPercentages = splitPercentages;
    }

}