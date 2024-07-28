import { Router } from "express";
import { professorController } from "../controllers/professors";
import { userController } from "../controllers/user";

const professorRouter = Router()
//professorRouter.post('/', professorController.insertProfesssor)
professorRouter.get('/', userController.verifyToken, professorController.listProfessors)

export {
  professorRouter
}