import sqlite3 from "sqlite3";
//extraction_results2023.08.07_anonymized
const DATABASE_FILE = './extraction_results2023.08.07_anonymized.db'
//historico_RBM.db
if(!DATABASE_FILE)
  throw new Error('Banco de dados não informado')

export const openConnection = () => {
  let db = new sqlite3.Database(DATABASE_FILE)
  return db
}

export const dbQuery = (query: string, params?: any[]) => {
  let db = openConnection();
  return new Promise<any[]>((resolve, reject) => {

      db.all(query, params, (err, rows) => {
          if(err)
              reject(err);
          else
              resolve(rows);
      })

  })
  .finally(() => {
      db.close();
  })
}