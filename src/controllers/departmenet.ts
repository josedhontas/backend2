import { Request, Response } from "express";
import { Department, departmentModel } from "../models/department";
import { badRequest, internalServerError, notFound, ok} from "../services/error";

const insertDepartment = (req: Request, res: Response) => {
  const department = req.body as Department
  if(!department)
    return badRequest(res, 'Departamento invalido')

  return departmentModel.insertDepartment(department)
    .then(department => {
      res.json(department)
    })
    .catch(err => internalServerError(res, err))
}

const listDepartment = ({}: Request, res: Response) => {
  departmentModel.listDerpatments()
    .then(departments => {
      res.json(departments)
    })
    .catch(err => internalServerError(res, err))
}

const getDepartment = (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  return departmentModel.getDepartment(id)
    .then(department => {
      if(department)
        return res.json(department)
      else
        return notFound(res)
    })
}

const updataDepartment = (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const departmentExist = departmentModel.getDepartment(id)
  if(!departmentExist)
    return notFound(res)

  const department = req.body as Department
  return departmentModel.updateDepartment(department)
    .then(department => {
      res.json(department)
    })
    .catch(err => internalServerError(res, err))
}

const deleteDepartment = (req: Request, res: Response) => {
  const id = parseInt(req.params.id)
  const studentExist = departmentModel.getDepartment(id)
  if(!studentExist)
    return notFound(res)
  return departmentModel.deleteDepartment(id)
    .then(() => ok(res))
    .catch(err => internalServerError(res, err))
}

export const departmentController = {
  insertDepartment,
  listDepartment,
  getDepartment,
  updataDepartment,
  deleteDepartment
}