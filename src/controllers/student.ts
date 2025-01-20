import { Request, Response } from "express";
import { Student, studentModel } from "../models/student";
import { badRequest, internalServerError, notFound, ok } from "../services/error";

const insertStudent = (req: Request, res: Response) => {
  const student = req.body as Student;

  if (!student) return badRequest(res, "Estudante inválido!");

  if (!student.name) return badRequest(res, `Nome inválido!`);

  return studentModel.insertStudent(student)
    .then(() => res.status(201).json({ message: "Estudante inserido com sucesso." }))
    .catch(err => internalServerError(res, err));
};

const listStudents = (_req: Request, res: Response) => {
  studentModel.listStudents()
    .then(students => res.json(students))
    .catch(err => internalServerError(res, err));
};

const getStudent = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  studentModel.getStudent(id)
    .then(student => {
      if (student) return res.json(student);
      return notFound(res);
    })
    .catch(err => internalServerError(res, err));
};

const updateStudent = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  studentModel.getStudent(id)
    .then(studentExist => {
      if (!studentExist) return notFound(res);

      const student = req.body as Student;
      return studentModel.updateStudent(student)
        .then(() => res.json({ message: "Estudante atualizado com sucesso." }))
        .catch(err => internalServerError(res, err));
    });
};

const deleteStudent = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  studentModel.getStudent(id)
    .then(studentExist => {
      if (!studentExist) return notFound(res);

      return studentModel.deleteStudent(id)
        .then(() => ok(res))
        .catch(err => internalServerError(res, err));
    });
};

const getWorkloadPending = (req: Request, res: Response) => {
  const course_id = parseInt(req.params.course_id);
  const period_init = req.params.period_init;
  const period_end = req.params.period_end;

  studentModel.getWorkloadPending(course_id, period_init, period_end)
    .then(workload => res.json(workload))
    .catch(err => internalServerError(res, err));
};

const getCurriculumData = (req: Request, res: Response) => {
  const course_id = parseInt(req.params.course_id);
  const period_init = req.params.period_init;
  const period_end = req.params.period_end;

  studentModel.getCurriculumData(course_id, period_init, period_end)
    .then(bolha => res.json(bolha))
    .catch(err => internalServerError(res, err));
};

const getBoxPlot = (req: Request, res: Response) => {
  const course_id = parseInt(req.params.course_id);

  studentModel.getBoxPlot(course_id)
    .then(boxPlot => res.json(boxPlot))
    .catch(err => internalServerError(res, err));
};

const getViolinPlot = (req: Request, res: Response) => {
  const course_id = parseInt(req.params.course_id);
  const period_init = req.params.period_init;
  const period_end = req.params.period_end;

  studentModel.getViolinPlot(course_id, period_init, period_end)
    .then(workload => res.json(workload))
    .catch(err => internalServerError(res, err));
};

// Novo método para Sankey
const getSankeyData = (req: Request, res: Response) => {
  const course_id = parseInt(req.params.course_id);
  const period_init = req.params.period_init;
  const period_end = req.params.period_end;

  /*studentModel.getSankeyData(course_id, period_init)
    .then(data => res.json(data))
    .catch(err => internalServerError(res, err));
  */
};

export const studentController = {
  insertStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getWorkloadPending,
  getCurriculumData,
  getBoxPlot,
  getViolinPlot,
};

