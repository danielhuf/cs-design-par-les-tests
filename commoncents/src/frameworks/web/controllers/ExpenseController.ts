import { Request, Response } from "express";
import { MemberAddsExpenseToGroup } from "../../../usecases/MemberAddsExpenseToGroup";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";
export class ExpenseController {
  private memberAddsExpenseToGroupUseCase: MemberAddsExpenseToGroup;

  constructor(memberAddsExpenseToGroupUseCase: MemberAddsExpenseToGroup) {
    this.memberAddsExpenseToGroupUseCase = memberAddsExpenseToGroupUseCase;
  }

  public async addExpenseToGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Group id is required" });
      return;
    }
    if (!this.validateExpenseRequestBody(req, res)) {
      return;
    }
    const { title, amount, payerName, date, isPercentual, split } = req.body;
    try {
      this.memberAddsExpenseToGroupUseCase.execute(id, title, amount, payerName, date, isPercentual, split);
    } catch (error) {
      if (error instanceof GroupNotFoundError) {
        res.status(404).json({ error: "Group not found" });
        return;
      } else if (error instanceof Error){
        if (error.message) {
          res.status(400).json({ error: error.message });
          return;
        }
      }
    }
    res.status(200).json({ success: true });
  }

  private validateExpenseRequestBody(req: Request, res: Response): boolean {
    if (!req.body) {
      res.status(400).json({ error: "Invalid request" });
      return false;
    }
    const { title, amount, payerName, date, isPercentual, split } = req.body;
    if (split && typeof split !== "object") {
      res.status(400).json({ error: "Expense split must be an object" });
      return false;
    }
    const missingFields = [];
    if (!title) {
      missingFields.push("title");
    }
    if (!amount) {
      missingFields.push("amount");
    }
    if (!payerName) {
      missingFields.push("payerName");
    }
    if (!date) {
      missingFields.push("date");
    }
    if (!isPercentual) {
      missingFields.push("isPercentual");
    }
    if (!split) {
      missingFields.push("split");
    }
    if (missingFields.length > 0) {
      res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
      return false;
    }
    return true;
  }
}