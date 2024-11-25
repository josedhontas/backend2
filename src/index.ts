import express from "express";
import helmet from "helmet";
import { useRoutes } from "./routes";


const app = express()
const cors = require('cors')
app.use(express.json())
app.use(helmet())
app.use(cors())
useRoutes(app)


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`))