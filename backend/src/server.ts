// src/server.ts
import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import unidadesRoutes from "./routes/unidades.routes";
import atividadesRoutes from "./routes/atividades.routes";
import disciplinasRoutes from "./routes/disciplinas.routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();
const isDev = process.env.NODE_ENV !== 'production';
app.use(cors({
  origin: isDev ? true : (process.env.FRONTEND_URL || 'http://localhost:8081')
}));
console.log(`CORS configured. Development mode: ${isDev}. FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);

app.use(express.json());

app.use("/unidades", unidadesRoutes);
app.use("/atividades", atividadesRoutes);
app.use("/disciplinas", disciplinasRoutes);

// Catch-all para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Rota não encontrada',
      code: 'NOT_FOUND',
      path: req.path,
      timestamp: new Date().toISOString()
    }
  });
});

// Middleware de erro centralizado (deve ser o último)
app.use(errorHandler);

app.listen(3333, () => {
  console.log("API rodando em http://localhost:3333");
});