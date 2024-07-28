import { Router } from "express";
import { disciplinesController } from "../controllers/discipline";
import { userController } from "../controllers/user";

const disciplineRouter = Router()

disciplineRouter.get('/', userController.verifyToken, disciplinesController.getDisicplines)
disciplineRouter.get('/mandatory', userController.verifyToken, disciplinesController.getDisicplinesMandatory)
disciplineRouter.get('/curricular_grade', userController.verifyToken, disciplinesController.getCurricularGrade)
disciplineRouter.get('/disciplinesByPeriod/:curriculum_id', userController.verifyToken, disciplinesController.getDisciplinesByCurricularGrade)

export {
  disciplineRouter
}