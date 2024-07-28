import { dbQuery2 } from "../services/db2";

export type User = {
 name: string,
 email: string,
 password: string
}

const insertUser = async (name: string, email: string, password: string) => {
 await dbQuery2(`INSERT INTO users(name, email, password) VALUES(?, ?, ?)`,
  [name, email, password])
}

const getUser = async (email: string) => {
 const retorno = await dbQuery2(`SELECT * FROM users WHERE email = ?`, [email])
 return retorno[0] as User
}
export const userModel = {
 insertUser,
 getUser
}