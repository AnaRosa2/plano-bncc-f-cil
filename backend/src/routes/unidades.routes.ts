// src/routes/unidades.routes.ts
import { Router } from "express";
import { gerarConteudo, gerarAtividade, sugerirUnidades } from "../services/geracao.service";
import { gerarSlides } from "../services/geracao.service.slides";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { disciplina, tema } = req.body;
    if (!disciplina || !tema) {
      return res.status(400).json({ error: "Disciplina e tema são obrigatórios." });
    }
    const resultado = await gerarConteudo(disciplina, tema);
    res.json(resultado);
  } catch (error: any) {
    console.error("❌ Erro COMPLETO:", error);
    console.error("❌ Mensagem:", error.message);
    res.status(500).json({ error: "Falha ao gerar plano de aula." });
  }
});

// Nova rota: gerar atividade via unidade (fallback seguro)
router.post("/atividade", async (req, res) => {
  try {
    const { tema, tipo, anoSerie, quantidade } = req.body;
    console.log('[unidades/atividade] request origin:', req.headers.origin || req.ip);
    console.log('[unidades/atividade] body:', JSON.stringify(req.body));

    if (!tema || !tipo) {
      return res.status(400).json({ error: 'Tema e tipo são obrigatórios.' });
    }

    const q = Number(quantidade) || 1;
    console.log(`[unidades/atividade] generating ${q} ${tipo} for tema=${tema} anoSerie=${anoSerie}`);
    const resultado = await gerarAtividade(tema, tipo, anoSerie, q);
    console.log('[unidades/atividade] result count:', Array.isArray(resultado) ? resultado.length : 1);
    res.json(resultado);
  } catch (error: any) {
    console.error('❌ Erro ao gerar atividade (unidades/atividade):', error?.message || error, error?.stack);
    res.status(500).json({ error: 'Falha ao gerar atividade.' });
  }
});

router.post('/sugerir-tema', async (req, res) => {
  try {
    const { disciplina, anoSerie, quantidade } = req.body;
    console.log('[unidades/sugerir-tema] origin:', req.headers.origin || req.ip);
    console.log('[unidades/sugerir-tema] body:', JSON.stringify(req.body));

    if (!disciplina) return res.status(400).json({ error: 'Disciplina é obrigatória.' });

    const q = Number(quantidade) || 3;
    const resultado = await sugerirUnidades(disciplina, anoSerie, q);
    res.json(resultado);
  } catch (error: any) {
    console.error('[unidades/sugerir-tema] Erro:', error?.message || error, error?.stack);
    res.status(500).json({ error: 'Falha ao sugerir unidades.' });
  }
});

// RF06 - Gerar slides educacionais
router.post('/slides', async (req, res) => {
  try {
    const { tema, disciplina, anoSerie } = req.body;
    console.log('[unidades/slides] origin:', req.headers.origin || req.ip);
    console.log('[unidades/slides] body:', JSON.stringify(req.body));

    if (!tema || !disciplina) {
      return res.status(400).json({ error: 'Tema e disciplina são obrigatórios.' });
    }

    const slides = await gerarSlides(tema, disciplina, anoSerie);
    res.json(slides);
  } catch (error: any) {
    console.error('[unidades/slides] Erro:', error?.message || error, error?.stack);
    res.status(500).json({ error: 'Falha ao gerar slides.' });
  }
});

export default router;