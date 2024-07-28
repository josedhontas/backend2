import { Router } from "express";
import { studentController } from "../controllers/student";
import { userController } from "../controllers/user";

const studentRouter = Router()
//studentRouter.post('/', studentController.insertStudent)
studentRouter.get('/', userController.verifyToken, studentController.listStudents)
studentRouter.get('/:id', userController.verifyToken, studentController.getStudent)
studentRouter.get('/workload/:course_id/:period_init/:period_end', userController.verifyToken, studentController.getWorkloadPending)
studentRouter.get('/bolha/:course_id/:period_init/:period_end', userController.verifyToken, studentController.getCurriculumData)
studentRouter.get('/boxplot/:course_id', userController.verifyToken, studentController.getBoxPlot)
studentRouter.get('/violinplot/:course_id/:period_init/:period_end', userController.verifyToken, studentController.getViolinPlot)
studentRouter.get('/sankey/:period_init/:period_end', userController.verifyToken, studentController.getSankeyData)


//studentRouter.put('/:id', studentController.updateStudent)
//studentRouter.delete('/:id', studentController.deleteStudent)

export {
  studentRouter
}