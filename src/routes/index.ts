import { Application } from "express";
import Router from "express";
import { studentRouter } from "./student";
import { departmentRouter } from "./department";
import { professorRouter } from "./professor";
import { grafico1Router } from "./grafico1";
import { disciplineRouter } from "./discipline";
import { emailRouter } from "./email";
import { userRouter } from "./user";

export const useRoutes = (app: Application) => {
  const apiRouter = Router();
  apiRouter.use('/student', studentRouter);
  apiRouter.use('/department', departmentRouter);
  apiRouter.use('/professor', professorRouter);
  apiRouter.use('/grafico1', grafico1Router);
  apiRouter.use('/disciplines', disciplineRouter);
  apiRouter.use('/emails', emailRouter);
  apiRouter.use('/user', userRouter);
  app.use('/api/teste_student', apiRouter);
}