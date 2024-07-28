import { Request, Response } from "express";
import { disciplineModel } from "../models/discipline";
import { internalServerError } from "../services/error";

const getDisicplines = ({ }: Request, res: Response) => {
  disciplineModel.getDisciplines()
    .then(disciplines => {
      res.json(disciplines)
    })
    .catch(err => internalServerError(res, err))
}

const getDisicplinesMandatory = ({ }: Request, res: Response) => {
  disciplineModel.getDisciplinesMandatory()
    .then(disciplines => {
      res.json(disciplines)
    })
    .catch(err => internalServerError(res, err))
}

const getCurricularGrade = ({ }: Request, res: Response) => {
  disciplineModel.getCrurricularGrade()
    .then(curricular_grade => {
      res.json(curricular_grade)
    })
    .catch(err => internalServerError(res, err))
}

const getDisciplinesByCurricularGrade = (req: Request, res: Response) => {
  const curriculum_id = parseInt(req.params.curriculum_id)
  disciplineModel.getDisciplinesByCurricularGrade(curriculum_id)
    .then(disciplineByPeriod => {
      res.json(disciplineByPeriod)
    })
    .catch(err => internalServerError(res, err))
}

export const disciplinesController = {
  getDisicplines,
  getDisicplinesMandatory,
  getCurricularGrade,
  getDisciplinesByCurricularGrade
}