// src/routes/atividades.routes.ts
import { Router } from "express";
import { gerarAtividade } from "../services/geracao.service";

const router = Router();

router.post('/gerar', async (req, res) => {
  try {
    const { tema, tipo, anoSerie, quantidade } = req.body;
    
    if (!tema || !tipo) {
      return res.status(400).json({ error: 'Tema e tipo são obrigatórios.' });
    }

    const q = Number(quantidade) || 1;
    const resultado = await gerarAtividade(tema, tipo, anoSerie, q);
    
    res.json(resultado);
  } catch (error: any) {
    console.error('❌ Erro ao gerar atividade:', error?.message || error, error?.stack);
    res.status(500).json({ error: 'Falha ao gerar atividade.' });
  }
});

export default router;
