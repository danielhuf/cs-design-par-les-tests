import { Request, Response } from "express";
import { GroupNotFoundError } from "../../../domain/errors/GroupErrors";
import { MemberPaysOffDebt } from "../../../usecases/MemberPaysOffDebt";
export class PayOffController {
  private memberPaysOffDebtUseCase: MemberPaysOffDebt;

  constructor(memberPaysOffDebtUseCase: MemberPaysOffDebt) {
    this.memberPaysOffDebtUseCase = memberPaysOffDebtUseCase;
  }

  public async addPayOffToGroup(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Group id is required" });
      return;
    }
    if (!this.validatePayOffRequestBody(req, res)) {
      return;
    }
    const { title, amount, payerName, date, payTo} = req.body;
    try {
      const group = this.memberPaysOffDebtUseCase.execute(id, title, amount, payerName, date, payTo);
      res.status(200).json(group);
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
  }

  private validatePayOffRequestBody(req: Request, res: Response): boolean {
    if (!req.body) {
      res.status(400).json({ error: "Invalid request" });
      return false;
    }
    const { title, amount, payerName, date, payTo} = req.body;
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
    if (!payTo) {
      missingFields.push("payTo");
    }
    if (missingFields.length > 0) {
      res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
      return false;
    }
    return true;
  }
}