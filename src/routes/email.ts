import { Router } from "express";
import { emailController } from "../controllers/email";
import { userController } from "../controllers/user";

const emailRouter = Router()

emailRouter.get('/', userController.verifyToken, emailController.listEmails)

export {
  emailRouter
}