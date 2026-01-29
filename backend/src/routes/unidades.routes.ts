// src/routes/unidades.routes.ts
import { Router } from "express";
import { gerarConteudo, gerarAtividade, sugerirUnidades, sugerirDetalhesUnidade } from "../services/geracao.service";
import { gerarSlides } from "../services/geracao.service.slides";

const router = Router();

// Rota de status para verificar se o deploy foi concluído
router.get("/status", (req, res) => {
  res.json({
    status: "ok",
    version: "2026-01-27-20:43",
    prompts: "DENSO_V2_LIMPEZA_MARCADORES",
    message: "O cérebro está atualizado!"
  });
});

router.post("/", async (req, res) => {
  try {
    const { disciplina, tema, anoSerie, metodologiaId } = req.body;
    if (!disciplina || !tema) {
      return res.status(400).json({ error: "Disciplina e tema são obrigatórios." });
    }
    const resultado = await gerarConteudo(disciplina, tema, anoSerie, metodologiaId);
    res.json(resultado);
  } catch (error: any) {
    console.error("Erro ao gerar plano de aula:", error.message);
    res.status(500).json({ error: "Falha ao gerar plano de aula." });
  }
});

// Nova rota: gerar atividade via unidade (fallback seguro)
router.post("/atividade", async (req, res) => {
  try {
    const { tema, tipo, anoSerie, quantidade } = req.body;

    if (!tema || !tipo) {
      return res.status(400).json({ error: 'Tema e tipo são obrigatórios.' });
    }

    const q = Number(quantidade) || 1;
    const resultado = await gerarAtividade(tema, tipo, anoSerie, q);

    res.json(resultado);
  } catch (error: any) {
    console.error('Erro ao gerar atividade (unidades/atividade):', error?.message || error);
    res.status(500).json({ error: 'Falha ao gerar atividade.' });
  }
});

router.post('/sugerir-tema', async (req, res) => {
  try {
    const { disciplina, anoSerie, quantidade } = req.body;

    if (!disciplina) return res.status(400).json({ error: 'Disciplina é obrigatória.' });

    const q = Number(quantidade) || 3;
    const resultado = await sugerirUnidades(disciplina, anoSerie, q);
    res.json(resultado);
  } catch (error: any) {
    console.error('Erro ao sugerir unidades:', error?.message || error);
    res.status(500).json({ error: 'Falha ao sugerir unidades.' });
  }
});

router.post('/sugerir-detalhes', async (req, res) => {
  try {
    const { disciplina, tema, anoSerie } = req.body;

    if (!tema || !disciplina) {
      return res.status(400).json({ error: 'Tema e disciplina são obrigatórios.' });
    }

    const resultado = await sugerirDetalhesUnidade(disciplina, tema, anoSerie);
    res.json(resultado);
  } catch (error: any) {
    console.error('Erro ao sugerir detalhes da unidade:', error?.message || error);
    res.status(500).json({ error: 'Falha ao sugerir detalhes com IA.' });
  }
});

// RF06 - Gerar slides educacionais
router.post('/slides', async (req, res) => {
  try {
    const { tema, disciplina, anoSerie } = req.body;

    if (!tema || !disciplina) {
      return res.status(400).json({ error: 'Tema e disciplina são obrigatórios.' });
    }

    const slides = await gerarSlides(tema, disciplina, anoSerie);
    res.json(slides);
  } catch (error: any) {
    console.error('Erro ao gerar slides:', error?.message || error);
    res.status(500).json({ error: 'Falha ao gerar slides.' });
  }
});

export default router;