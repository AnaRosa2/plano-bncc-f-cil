// src/routes/disciplinas.routes.ts
import { Router } from 'express';
import { gerarDisciplina } from '../services/geracao.service';

const router = Router();

router.post('/gerar', async (req, res) => {
  try {
    const { anoSerie, tema } = req.body;
    if (!anoSerie || !tema) {
      return res.status(400).json({ error: 'anoSerie e tema são obrigatórios.' });
    }

    const resultado = await gerarDisciplina(anoSerie, tema);
    res.json(resultado);
  } catch (error: any) {
    console.error('❌ Erro ao gerar disciplina:');
    console.error('Message:', error?.message || error);
    console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    res.status(500).json({ error: 'Falha ao gerar disciplina.' });
  }
});

export default router;
