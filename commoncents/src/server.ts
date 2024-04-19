
import { GroupRepository } from "./frameworks/persistence/GroupRepository"
import { CreateGroup } from "./usecases/CreateGroup"
import { AddMemberToGroup } from "./usecases/AddMemberToGroup"
import { DeleteMemberFromGroup } from "./usecases/DeleteMemberFromGroup"
import { DeleteGroup } from "./usecases/DeleteGroup"
import { MemberAddsExpenseToGroup } from "./usecases/AddExpenseToGroup"
import { GroupController } from "./frameworks/web/controllers/GroupController"
import { MemberController } from "./frameworks/web/controllers/MemberController"
import { ExpenseController } from "./frameworks/web/controllers/ExpenseController"
import { ApiServer } from "./frameworks/web/ApiServer"


export async function startServer(): Promise<void> {
  const groupRepository = new GroupRepository()
  const createGroup = new CreateGroup(groupRepository)
  const addMemberToGroup = new AddMemberToGroup(groupRepository)
  const deleteMemberFromGroup = new DeleteMemberFromGroup(groupRepository)
  const deleteGroup = new DeleteGroup(groupRepository)
  const memberAddsExpenseToGroup = new MemberAddsExpenseToGroup(groupRepository)

  const groupController = new GroupController(createGroup, deleteGroup)
  const memberController = new MemberController(addMemberToGroup, deleteMemberFromGroup)
  const expenseController = new ExpenseController(memberAddsExpenseToGroup)

  await ApiServer.run(5000, groupController, memberController, expenseController);
}

startServer()