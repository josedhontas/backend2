import { Request, Response } from "express";
import { Professor, professorModel } from "../models/professor";
import { badRequest, internalServerError, notFound, ok} from "../services/error";

const insertProfesssor = (req: Request, res: Response) => {
  
  {
    const professor = req.body as Professor
    if(!professor)
      return badRequest(res, "professor invalido!")

    if(!(professor.name))
      return badRequest(res, `nome invalido!`)
  }

  const professor = req.body as Professor
  
  return professorModel.insertProfessor(professor)
    .then(professor =>{
      res.json(professor)
    })
    .catch(err => internalServerError(res, err))
}

const listProfessors = ({}: Request, res: Response) => {
  professorModel.listProfessors()
    .then(professors => {
      res.json(professors)
    })
    .catch(err => internalServerError(res, err))
}

export const professorController = {
  insertProfesssor,
  listProfessors
}