import { Router } from "express";
import { userController } from "../controllers/user";

const userRouter = Router()

userRouter.post('/', userController.registerUser)
userRouter.get('/', userController.loginUser)

export { userRouter }