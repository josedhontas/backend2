import { Router } from "express";
import { grafico1Controller } from "../controllers/grafico1";
import { userController } from "../controllers/user";

const grafico1Router = Router()
grafico1Router.get('/:course_id/:period_init/:period_end/:disciplines', userController.verifyToken, grafico1Controller.getData)
grafico1Router.get('/situation/:course_id/:period_init/:period_end/:discipline', userController.verifyToken, grafico1Controller.getDataByDiscipline)

export {
  grafico1Router
}