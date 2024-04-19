export class PayOff {

    title: string;
    amount: number;
    payerName: string;
    date: Date;
    payTo: string;

    constructor(title: string, amount: number, payerName: string, date: Date, payTo: string) {
        this.title = title;
        this.amount = amount;
        this.payerName = payerName;
        this.date = date;
        this.payTo = payTo;
    }
}