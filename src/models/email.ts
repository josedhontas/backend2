import { dbQuery2 } from "../services/db2";

const listEmails = async () => {
  const retorno = await dbQuery2(`SELECT * FROM emails`)
  return retorno as string[]
}

export const emailModel = {
  listEmails
}