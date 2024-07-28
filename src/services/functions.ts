import { dbQuery } from "./db";


export const getCurriculumsID = async (course_id: number) => {
  const retorno = await dbQuery(`SELECT id FROM curriculums WHERE course_id = ?`, [course_id])
  return retorno.map(item => item.id) as number[] | undefined
}

export const getDisciplinesIdByCode = async (codes: string[]) => {
  const queries = codes.map(code => dbQuery(`SELECT id FROM disciplines WHERE code = '${code}'`));
  const resultados = await Promise.all(queries);
  const ids: number[] = resultados.flatMap(resultado => resultado.map(item => item.id));
  return ids.length ? ids : undefined;
}

const departCode: string[] = ['COMP', 'ADM', 'ELET', 'FISI', 'MAT', 'LETR', 'FILO', 'ESTAT', 'EDFIS', 'PSIC']

export const isFromDepart = (code: string) => {
  for (const departCodeItem of departCode) {
    if (code.startsWith(departCodeItem)) {
      return true;
    }
  }
  return false;
}
