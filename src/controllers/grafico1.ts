import { Request, Response } from "express";
import { grafico1Model } from "../models/grafico1"
import { internalServerError } from "../services/error";


const getData = (req: Request, res: Response) => {
  const id = parseInt(req.params.course_id)
  const period_init = req.params.period_init
  const period_end = req.params.period_end
  const disciplines = req.params.disciplines.split(',')
  grafico1Model.getData(id, period_init, period_end, disciplines)
    .then(datas => {
      res.json(datas)
    })
    .catch(err => internalServerError(res, err))
}

const getDataByDiscipline = (req: Request, res: Response) => {
  const id = parseInt(req.params.course_id)
  const period_init = req.params.period_init
  const period_end = req.params.period_end
  const discipline = req.params.discipline.split(',')
  grafico1Model.getDataByDiscipline(id, period_init, period_end, discipline)
    .then(datas => {
      res.json(datas)
    })
    .catch(err => internalServerError(res, err))
}


export const grafico1Controller = {
  getData,
  getDataByDiscipline
}