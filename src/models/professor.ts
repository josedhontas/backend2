import { dbQuery } from "../services/db";

export type Professor = {
  id: number,
  name: string
}

const insertProfessor = async (professor: Professor) => {
  await dbQuery(`INSERT INTO professors(id, name) VALUES(?,?)`, [professor.id,professor.name])
}

const listProfessors = async () => {
  const retorno = await dbQuery(`SELECT * FROM professors`)
  return retorno as Professor[]
}

export const professorModel = {
  insertProfessor,
  listProfessors
}