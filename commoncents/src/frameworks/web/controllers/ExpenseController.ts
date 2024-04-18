import { Request, Response } from "express";
import { MemberAddsExpenseToGroup } from "../../../usecases/MemberAddsExpenseToGroup";
export class ExpenseController {
  private memberAddsExpenseToGroupUseCase: MemberAddsExpenseToGroup;

  constructor(memberAddsExpenseToGroupUseCase: MemberAddsExpenseToGroup) {
    this.memberAddsExpenseToGroupUseCase = memberAddsExpenseToGroupUseCase;
  }

  public async addExpenseToGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { title, amount, payerName, date, isPercentual, split } = req.body;
    this.memberAddsExpenseToGroupUseCase.execute(id, title, amount, payerName, date, isPercentual, split);
    res.status(200).json({ success: true });
  }
}