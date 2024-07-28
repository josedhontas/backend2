import { dbQuery } from "../services/db";
import { dbQuery2 } from "../services/db2";
import { isFromDepart } from "../services/functions";

export type discipline = {
  id: number,
  code: string,
  name: string,
  workload: number
}

export type disciplineByPeriod = {
  id: number,
  code: string,
  name: string,
  workload: number,
  period: number
}

export type curricular_grade = {
  id: number,
  shift: string,
  grade: number,
  created_at: string,
  course: string
}

export const getCrurricularGrade = async () => {
  const retorno = await dbQuery2(`SELECT * FROM curriculum`)
  return retorno as curricular_grade[] | undefined
}

export const getDisciplines = async () => {
  const retorno = await dbQuery(`SELECT * FROM disciplines`)
  return retorno as discipline[] | undefined
}

export const getDisciplinesMandatory = async () => {
  const obrigatorios: discipline[] = []
  const retorno = await dbQuery(`SELECT d.id, d.code, d.name FROM curricular_components cc 
  JOIN disciplines d ON cc.discipline_id = d.id
  WHERE cc.type = 'OBRIGATORIO' OR cc.type = 'EQ_OBRIGATORIO'`)
  retorno.forEach(disciplina => {
    if (isFromDepart(disciplina.code)) {
      if (!obrigatorios.some(item => item.code === disciplina.code)) {
        obrigatorios.push(disciplina)
      }
    }
  });
  return obrigatorios as discipline[] | undefined
}

export const getDisciplinesByCurricularGrade = async (curriculum_id: number) => {
  const retorno = await dbQuery2(`SELECT id, code, name, workload, period 
  FROM disciplineByCurriculum WHERE curriculum = ?`, [curriculum_id])
  return retorno as disciplineByPeriod[] | undefined
}

export const disciplineModel = {
  getDisciplines,
  getDisciplinesMandatory,
  getCrurricularGrade,
  getDisciplinesByCurricularGrade
}