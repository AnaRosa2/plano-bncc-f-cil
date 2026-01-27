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

export async function gerarConteudo(disciplina: string, tema: string, anoSerie: string = '', metodologiaId?: string) {
  const bncc = await getBnccSnippet();
  const fw = getFramework(anoSerie);

  let metodologiaContexto = '';
  if (metodologiaId) {
    const { METODOLOGIAS_ATIVAS } = require('../constants/metodologias');
    const meto = METODOLOGIAS_ATIVAS.find((m: any) => m.id === metodologiaId);
    if (meto) {
      metodologiaContexto = `
=== ESTRATÉGIA PEDAGÓGICA (METODOLOGIA ATIVA) ===
Nome: ${meto.nome}
Descrição: ${meto.descricao}
${meto.fases ? `Fases a incluir: ${meto.fases.join(', ')}` : ''}
Instrução: Adapte TODO o plano de aula para seguir RIGOROSAMENTE esta metodologia.
`;
    }
  }

  const prompt = `
=== SISTEMA DE GERAÇÃO PEDAGÓGICA AVANÇADA ===
Você é um consultor pedagógico sênior especialista em BNCC e Metodologias Ativas.
Sua missão é criar um PLANO DE AULA DENSO, DETALHADO e PROFISSIONAL.

=== CONTEXTO DA TURMA ===
- Etapa: ${fw.etapa}
- Nível de Maturidade: ${fw.foco}
- Tempo de Aula: ${fw.atencao} (Divida as atividades para não cansar o aluno)
- Recursos Disponíveis: ${fw.materiais}

${metodologiaContexto}

=== TEMA E DISCIPLINA ===
- Tema: "${tema}"
- Disciplina: "${disciplina}"

=== REGRAS CRÍTICAS DE FORMATAÇÃO E CONTEÚDO ===
1. PROIBIDO o uso de caracteres de formatação Markdown como "**" (negrito), "###" (títulos) ou qualquer outro símbolo fora de texto simples dentro dos valores do JSON.
2. O conteúdo deve ser RICO e DETALHADO. Não seja superficial. Descreva o passo a passo de cada momento da aula.
3. Use linguagem adequada à Etapa (${fw.etapa}), mas mantenha o rigor técnico para o professor.
4. Integre a BNCC (Cultura Digital) de forma orgânica no texto.

=== ESTRUTURA OBRIGATÓRIA (JSON) ===
Retorne estritamente um objeto JSON com as seguintes chaves (em letras minúsculas):
- "objetivo": Descreva 3 objetivos claros (Geral e Específicos).
- "metodologia": Detalhe o passo a passo da aula (Introdução, Desenvolvimento, Conclusão). Use listas numeradas se necessário (ex: 1. Início..., 2. Prática...).
- "meta": Explique as competências da BNCC desenvolvidas nesta aula.
- "atividade": Descreva uma atividade prática "mão na massa" usando os materiais recomendados (${fw.materiais}).

=== DATA SOURCE (BNCC) ===
${bncc}

RESPOSTA (APENAS O JSON, SEM TEXTO ADICIONAL):`;

  console.log(`[gerarConteudo] Gerando plano DENSO para: ${tema} (${fw.etapa}) ${metodologiaId ? `usando ${metodologiaId}` : ''}`);

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

    const asString = (val: any) => {
      if (!val) return '';
      if (typeof val === 'string') return val;
      return JSON.stringify(val, null, 2);
    };

    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: asString(conteudo.objetivo),
      metodologia: asString(conteudo.metodologia),
      meta: asString(conteudo.meta),
      atividade: asString(conteudo.atividade),
      metodologiaId // Retorna o ID para o frontend saber o que foi usado
    };
  } catch (error: any) {
    console.error('❌ Erro em gerarConteudo:', error.message);
    return {
      planoDeAula: `Plano: ${tema} (Fallback)`,
      objetivo: `[Aviso: Falha na IA - ${error.message}]\n\nOBJETIVO GERAL: Desenvolver conhecimento crítico sobre ${tema}.\n\nOBJETIVOS ESPECÍFICOS:\n• Analisar impactos de ${tema} na sociedade digital.\n• Aplicar ferramentas práticas alinhadas à BNCC.`,
      metodologia: `1. Introdução dialogada (10min)\n2. Atividade prática dirigida (30min)\n3. Síntese e avaliação (10min)`,
      meta: `Competências BNCC: CG05 (Cultura Digital). O aluno será capaz de mobilizar conhecimentos de ${tema} com ética e responsabilidade.`,
      atividade: `Utilizar recursos multimídia para explorar o tema ${tema} em sala.`,
      metodologiaId
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  const prompt = `
=== SISTEMA DE GERAÇÃO DE ATIVIDADES ===
Crie uma atividade educacional do tipo "${tipo}" sobre o tema "${tema}" para a etapa "${anoSerie || 'Ensino Fundamental'}".

=== REGRAS OBRIGATÓRIAS ===
1. PROIBIDO o uso de markdown como "**" ou "###". Use apenas texto simples.
2. Seja detalhado e criativo. A atividade deve ser desafiadora e pedagógica.
3. Inclua critérios de avaliação claros e objetivos para o professor.

=== ESTRUTURA JSON (ARRAY) ===
Retorne apenas um array JSON:
[
  {
    "enunciado": "Texto completo da questão ou descrição da atividade prática...",
    "criteriosAvaliacao": "O que o professor deve observar ao corrigir..."
  }
]

RESPOSTA (APENAS O ARRAY JSON):`;

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