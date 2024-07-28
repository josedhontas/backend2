import { Router } from "express";
import { departmentController } from "../controllers/departmenet";
import { userController } from "../controllers/user";

const departmentRouter = Router()
//departmentRouter.post('/', departmentController.insertDepartment)
departmentRouter.get('/', userController.verifyToken, departmentController.listDepartment)
departmentRouter.get('/:id', userController.verifyToken, departmentController.getDepartment)
//departmentRouter.put('/:id', departmentController.updataDepartment)
//departmentRouter.delete('/:id', departmentController.deleteDepartment)

export {
  departmentRouter
}