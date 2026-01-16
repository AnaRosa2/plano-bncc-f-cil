import express from "express";
import cors from "cors";
import unidadesRoutes from "./routes/unidades.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/unidades", unidadesRoutes);

app.listen(3333, () => {
  console.log("API rodando em http://localhost:3333");
});
