// src/services/geracao.service.ts
import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

async function getBnccSnippet() {
  return await getBnccText();
}

/**
 * Função utilitária para tentar gerar texto com retry
 */
export async function gerarComRetry(prompt: string, maxRetries = 1): Promise<string> {
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

const FRAMEWORK_PEDAGOGICO = {
  FUND_I: {
    etapa: 'Ensino Fundamental I (1º ao 5º ano)',
    foco: 'Ludicidade, descoberta orientada e linguagem simples.',
    materiais: 'Tesoura de ponta redonda ✂️, Cola bastão 🧴, EVA, Massinha de modelar, Palitos de sorvete, Tampinhas coloridas, Caixa de surpresa.',
    atencao: '10 a 15 minutos',
    estetica: 'Cores pastéis, personagens arredondados, ícones de materiais reais.'
  },
  FUND_II: {
    etapa: 'Ensino Fundamental II (6º ao 9º ano)',
    foco: 'Experimentos, metodologias ativas e tecnologia.',
    materiais: 'Materiais do cotidiano (garrafa PET, bicarbonato), Jogos de tabuleiro customizados, Materiais recicláveis, QR Codes.',
    atencao: '20 a 30 minutos',
    estetica: 'Design flat, infográficos minimalistas, moderno.'
  },
  MEDIO: {
    etapa: 'Ensino Médio',
    foco: 'Análise crítica, ética complexa, carreira e ENEM.',
    materiais: 'Estudos de caso reais (dados IBGE), Simuladores digitais (PhET, GeoGebra), Cartões de debate.',
    atencao: '45 a 50 minutos',
    estetica: 'Profissional, acadêmico, foco em dados.'
  }
};

function getFramework(anoSerie: string = '') {
  const s = anoSerie.toLowerCase();
  if (s.includes('médio') || s.includes('3º') || s.includes('ensino médio')) return FRAMEWORK_PEDAGOGICO.MEDIO;
  if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9')) return FRAMEWORK_PEDAGOGICO.FUND_II;
  return FRAMEWORK_PEDAGOGICO.FUND_I;
}

export async function gerarConteudo(disciplina: string, tema: string, anoSerie: string = '') {
  const bncc = await getBnccSnippet();
  const fw = getFramework(anoSerie);

  const prompt = `
=== CONTEXTO PEDAGÓGICO ===
Etapa: ${fw.etapa}
Foco: ${fw.foco}
Limite de Atenção: ${fw.atencao}
Materiais Recomendados: ${fw.materiais}

=== MISSÃO ===
Crie um PLANO DE AULA COMPLETO sobre "${tema}" para "${disciplina}".
Respeite RIGOROSAMENTE a maturidade cognitiva da etapa ${fw.etapa}.

=== REQUISITOS DE CONTEÚDO ===
1. DIFERENCIAÇÃO: Ajuste o nível de complexidade para o limite de atenção de ${fw.atencao}.
2. MATERIAIS: Integre o uso de: ${fw.materiais}.
3. BNCC: Alinhe às competências de Cultura Digital.

${bncc}

APENAS JSON: {"objetivo":"...","metodologia":"...","meta":"...","atividade":"..."}`;

  console.log(`[gerarConteudo] Gerando plano para: ${tema} (${fw.etapa})`);

  try {
    const respostaBruta = await gerarComRetry(prompt);

    // Extração robusta de JSON
    const firstBrace = respostaBruta.indexOf('{');
    const lastBrace = respostaBruta.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      console.warn('[gerarConteudo] Resposta não contém JSON válido:', respostaBruta);
      throw new Error('Formato de resposta inválido da IA');
    }

    const jsonStr = respostaBruta.substring(firstBrace, lastBrace + 1);
    const conteudo = JSON.parse(jsonStr);

    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: conteudo.objetivo || '',
      metodologia: conteudo.metodologia || '',
      meta: conteudo.meta || '',
      atividade: conteudo.atividade || ''
    };
  } catch (error: any) {
    console.error('❌ Erro em gerarConteudo:', error.message);
    return {
      planoDeAula: `Plano: ${tema} (Fallback)`,
      objetivo: `[Aviso: Falha na IA - ${error.message}]\n\nOBJETIVO GERAL: Desenvolver conhecimento crítico sobre ${tema}.\n\nOBJETIVOS ESPECÍFICOS:\n• Analisar impactos de ${tema} na sociedade digital.\n• Aplicar ferramentas práticas alinhadas à BNCC.`,
      metodologia: `1. Introdução dialogada (10min)\n2. Atividade prática dirigida (30min)\n3. Síntese e avaliação (10min)`,
      meta: `Competências BNCC: CG05 (Cultura Digital). O aluno será capaz de mobilizar conhecimentos de ${tema} com ética e responsabilidade.`,
      atividade: `Utilizar recursos multimídia para explorar o tema ${tema} em sala.`
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

export async function sugerirUnidades(disciplina: string, anoSerie: string = '', quantidade = 3) {
  const fw = getFramework(anoSerie);
  const prompt = `
=== CONTEXTO PEDAGÓGICO ===
Etapa: ${fw.etapa}
Foco: ${fw.foco}

=== MISSÃO ===
Sugira ${quantidade} temas de aula inovadores para "${disciplina}" (${anoSerie}).
Os temas devem ser adequados para ${fw.etapa}.

RETORNE APENAS UM ARRAY JSON: [{"tema":"...","objetivo":"..."}]`;

  console.log(`[sugerirUnidades] Buscando sugestões para: ${disciplina} (${fw.etapa})`);

  try {
    const res = await gerarComRetry(prompt);

    // Extração robusta de JSON (Array)
    const firstBracket = res.indexOf('[');
    const lastBracket = res.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1) {
      console.warn('[sugerirUnidades] JSON não encontrado na resposta');
      throw new Error('Formato de resposta inválido');
    }

    const jsonStr = res.substring(firstBracket, lastBracket + 1);
    return JSON.parse(jsonStr);
  } catch (e: any) {
    console.error('❌ Erro em sugerirUnidades:', e.message);
    // Sugestões inteligentes de fallback caso a IA falhe
    return [
      { tema: `Tendências em ${disciplina}`, objetivo: `Explorar os fundamentos de ${disciplina} na era digital.` },
      { tema: `Práticas em ${disciplina}`, objetivo: `Desenvolver competências práticas em ${disciplina}.` },
      { tema: `Desafios da ${disciplina}`, objetivo: `Analisar criticamente o impacto da ${disciplina} na sociedade.` }
    ];
  }
}