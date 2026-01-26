// src/services/geracao.service.ts
import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

async function getBnccSnippet() {
  return await getBnccText();
}

/**
 * Função utilitária para tentar gerar texto com retry
 */
async function gerarComRetry(prompt: string, maxRetries = 1): Promise<string> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await gerarTextoComIA(prompt);
    } catch (error) {
      console.warn(`[geracao.service] Tentativa ${i + 1} falhou.`, error);
      lastError = error;
      if (i < maxRetries) await new Promise(r => setTimeout(r, 1000));
    }
  }
  throw lastError;
}

export async function gerarConteudo(disciplina: string, tema: string) {
  const bncc = await getBnccSnippet();
  const prompt = `${bncc}\n\n=== MISSÃO ===\nCrie um PLANO DE AULA COMPLETO sobre "${tema}" para "${disciplina}".\nFoque no tema e nas competências da BNCC.\n\nAPENAS JSON: {"objetivo":"...","metodologia":"...","meta":"...","atividade":"..."}`;

  try {
    const respostaBruta = await gerarComRetry(prompt);
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON não encontrado');
    const conteudo = JSON.parse(jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim());

    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: conteudo.objetivo || '',
      metodologia: conteudo.metodologia || '',
      meta: conteudo.meta || '',
      atividade: conteudo.atividade || ''
    };
  } catch (error) {
    console.error('❌ Usando Fallback Pedagógico para Plano:', error);
    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: `OBJETIVO GERAL: Desenvolver conhecimento crítico sobre ${tema}.\n\nOBJETIVOS ESPECÍFICOS:\n• Analisar impactos de ${tema} na sociedade digital.\n• Aplicar ferramentas práticas alinhadas à BNCC.`,
      metodologia: `1. Introdução dialogada (10min)\n2. Atividade prática dirigida (30min)\n3. Síntese e avaliação (10min)`,
      meta: `Competências BNCC: CG05 (Cultura Digital). O aluno será capaz de mobilizar conhecimentos de ${tema} com ética e responsabilidade.`,
      atividade: `Mapa Conceitual Digital: Criar um infográfico sobre ${tema} usando ferramentas online.`
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  const prompt = `Crie uma atividade ${tipo} sobre ${tema} para ${anoSerie || 'fundamental'}.\nAPENAS JSON: [{"enunciado":"...","criteriosAvaliacao":"..."}]`;

  try {
    const respostaBruta = await gerarComRetry(prompt);
    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : (respostaBruta.match(/\{[\s\S]*\}/)?.[0] || '[]');
    const parsed = JSON.parse(jsonStr.replace(/```json/g, '').replace(/```/g, '').trim());
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (error) {
    console.error('❌ Usando Fallback para Atividade:', error);
    return [{
      enunciado: `ATIVIDADE SOBRE ${tema.toUpperCase()}\n\n1. Qual a importância de ${tema} para a Cultura Digital?\n2. Como aplicar os conceitos de ${tema} com ética?`,
      criteriosAvaliacao: `Avaliação (0-10pts): Domínio de conteúdo e clareza argumentativa.`
    }];
  }
}

export async function gerarDisciplina(anoSerie: string, tema: string) {
  const prompt = `Crie uma disciplina de Cultura Digital para ${anoSerie} focada em ${tema}.\nJSON: {"nome":"...","descricao":"...","sugestoesUnidades":[]}`;
  try {
    const res = await gerarComRetry(prompt);
    return JSON.parse(res.match(/\{[\s\S]*\}/)?.[0] || '{}');
  } catch (e) {
    return { nome: `Disciplina: ${tema}`, descricao: `Foco em Cultura Digital para ${anoSerie}.`, sugestoesUnidades: [] };
  }
}

export async function sugerirUnidades(disciplina: string, anoSerie?: string, quantidade = 3) {
  const prompt = `Sugira ${quantidade} temas para ${disciplina} (${anoSerie}).\nJSON: [{"tema":"...","objetivo":"..."}]`;
  try {
    const res = await gerarComRetry(prompt);
    return JSON.parse(res.match(/\[[\s\S]*\]/)?.[0] || '[]');
  } catch (e) {
    return Array.from({ length: quantidade }, (_, i) => ({ tema: `Unidade ${i + 1}`, objetivo: `Baseada em ${disciplina}` }));
  }
}