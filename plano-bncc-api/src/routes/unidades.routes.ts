import { Router } from "express";
import { gerarConteudo } from "../services/geracao.service";

const router = Router();

router.post("/", (req, res) => {
  const { disciplina, tema } = req.body;

  const resultado = gerarConteudo(disciplina, tema);

  res.json(resultado);
});

export default router;
