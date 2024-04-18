import { PayOff } from '../../src/domain/entities/PayOff';

describe('PayOff', () => {
    it("should create a pay off", () => {
        const title = "Dinner";
        const amount = 50;
        const payerName = "Alice";
        const payTo = "Bob";
        const date = new Date();
        
        const payOff = new PayOff(title, amount, payerName, date, payTo);
        
        expect(payOff.title).toBe(title);
        expect(payOff.amount).toBe(amount);
        expect(payOff.payerName).toBe(payerName);
        expect(payOff.date).toBe(date);
        expect(payOff.payTo).toBe(payTo);
      });
});
