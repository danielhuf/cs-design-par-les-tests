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
}