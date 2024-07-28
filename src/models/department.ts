import { dbQuery } from "../services/db"

export type Department = {
  id: number,
  name: string
}

const insertDepartment = async (department: Department) => {
  await dbQuery(`INSERT INTO departments(id, name) VALUES(?, ?)`, 
  [department.id, department.name]) 
}

const listDerpatments = async () => {
  const retorno = await dbQuery(`SELECT * FROM departments`)
  return retorno as Department[]
}

const getDepartment = async (id: number) => {
  const retorno = await dbQuery(`SELECT * FROM departments WHERE id = ?`, [id])
  return retorno[0] as Department | undefined
}

const updateDepartment = async (department: Department) => {
  await dbQuery(`UPDATE departments SET name = ? WHERE id = ?`, [department.name, department.id])
}

const deleteDepartment = async (id: number) =>{
  await dbQuery(`DELETE FROM departments WHERE id = ?`, [id])
}

export const departmentModel = {
  insertDepartment,
  listDerpatments,
  getDepartment,
  updateDepartment,
  deleteDepartment
}