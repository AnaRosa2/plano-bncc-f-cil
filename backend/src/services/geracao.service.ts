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
=== MASTER EDUCADOR IA: PLANEJAMENTO BNCC/MEC ===
Você é um consultor pedagógico sênior. Crie um plano de aula DEEP DIVE (PROFUNDO), TÉCNICO e PROFISSIONAL.
O plano DEVE conter termos técnicos da disciplina e ser rigorosamente adaptado para "${anoSerie}".

--- DADOS DO PLANO ---
- Disciplina: "${disciplina}"
- Tema: "${tema}"
- Etapa/Ano: "${anoSerie}"
${metodologiaId ? `- Foco em Metodologia Ativa: "${metodologiaId}"` : ''}

--- DIRETRIZES DE CONTEÚDO (RIGOR MÁXIMO) ---
1. PROFUNDIDADE: Não seja genérico. Use terminologia técnica da disciplina. Detalhe os conceitos.
2. DIFERENCIAÇÃO POR NÍVEL: 
   - EF I: Foco em ludicidade e pensamento computacional concreto.
   - EF II: Foco em lógica, resolução de problemas e colaboração.
   - EM: Foco em ética algorítmica, impactos sociais e autonomia técnica.
3. FORMATAÇÃO:
   - PROIBIDO: Markdown (#, **, ###) ou colchetes extras [[ ]]. Use TEXTO LIMPO.
   - METODOLOGIA: Divida em fases: "INÍCIO:", "DESENVOLVIMENTO:" e "ENCERRAMENTO:". Use \n\n entre elas.

--- ESTRUTURA JSON OBRIGATÓRIA (APENAS O JSON) ---
{
  "objetivo": "Objetivos claros (Bloom). Detalhe o que o aluno saberá ao final.",
  "metodologia": "INÍCIO: [Contexto]\n\nDESENVOLVIMENTO: [Atividades Centrais]\n\nENCERRAMENTO: [Síntese]",
  "recursos": "Texto corrido descrevendo materiais, softwares e apps necessários.",
  "meta": "Habilidades BNCC (Códigos) | Eixos Cultura Digital (MEC) | Diretrizes de Inclusão. (TEXTO LIMPO, SEM COLCHETES)",
  "atividade": "Detalhe uma atividade prática que consolide o aprendizado.",
  "tempo": "Duração sugerida (ex: 2 aulas de 50min)"
}

RESPOSTA (APENAS O JSON):`;

  console.log(`[gerarConteudo] Gerando plano PEDAGÓGICO RIGOROSO para: ${tema}`);

  try {
    const respostaBruta = await gerarComRetry(prompt);
    const firstBrace = respostaBruta.indexOf('{');
    const lastBrace = respostaBruta.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error('JSON inválido');

    const jsonStr = respostaBruta.substring(firstBrace, lastBrace + 1);
    const c = JSON.parse(jsonStr);

    const clean = (val: any) => {
      if (!val) return '';
      let s = typeof val === 'string' ? val : (Array.isArray(val) ? val.join(', ') : JSON.stringify(val));
      return s.replace(/\*\*/g, '').replace(/[#{}]/g, '').replace(/\\n/g, '\n').trim();
    };

    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: clean(c.objetivo),
      metodologia: clean(c.metodologia),
      recursos: clean(c.recursos),
      meta: clean(c.meta),
      atividade: clean(c.atividade),
      tempoEstimado: clean(c.tempo || c.tempoEstimado),
      metodologiaId
    };
  } catch (error: any) {
    console.error('❌ Erro em gerarConteudo:', error.message);
    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: `Desenvolver competências de ${tema} conforme BNCC.`,
      metodologia: `1. Acolhimento\n2. Atividade prática\n3. Reflexão final`,
      recursos: `Materiais básicos da sala de aula.`,
      meta: `BNCC: Cultura Digital aplicada a ${fw.etapa}.`,
      atividade: `Atividade prática sobre ${tema}.`,
      tempoEstimado: '50 min',
      metodologiaId
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  const prompt = `
=== MASTER EDUCADOR IA: GERAÇÃO DE ATIVIDADES AVALIATIVAS ===
Você é um especialista em avaliação educacional. Crie uma atividade TÉCNICA, PROFISSIONAL e DESAFIADORA.
A atividade deve testar o conhecimento do aluno em profundidade, não apenas superficialmente.

--- DADOS DA ATIVIDADE ---
- Tema: "${tema}"
- Tipo: "${tipo}"
- Público-alvo: "${anoSerie}"

--- REGRAS DE OURO ---
1. QUALIDADE: Use terminologia técnica. Proponha situações-problema e análise crítica.
2. EXTENSÃO: Gere exatamente 10 questões (objetivas ou dissertativas) ou um roteiro de desafio prático com 10 etapas claras de execução.
3. FORMATAÇÃO: PROIBIDO Markdown (#, **, ###) ou colchetes extras. Use TEXTO LIMPO.
4. INCLUSÃO: Adicione uma pequena nota técnica sobre como adaptar esta atividade para alunos com Dificuldades de Aprendizagem.

--- ESTRUTURA JSON OBRIGATÓRIA (ARRAY) ---
[
  {
    "enunciado": "1. [Questão/Etapa]... \n\n2. [Questão/Etapa]... \n\n(PROSSIGA ATÉ A 10)",
    "criteriosAvaliacao": "Critérios de correção detalhados e nota técnica de inclusão."
  }
]

RESPOSTA (APENAS O ARRAY JSON):`;

  try {
    const respostaBruta = await gerarComRetry(prompt);
    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : (respostaBruta.match(/\{[\s\S]*\}/)?.[0] || '[]');
    const parsed = JSON.parse(jsonStr.replace(/```json/g, '').replace(/```/g, '').trim());
    const items = Array.isArray(parsed) ? parsed : [parsed];

    // Se a IA retornou vários itens (um para cada questão), vamos concatenar
    if (items.length > 1) {
      return [{
        enunciado: items.map((it, idx) => it.enunciado || `Questão ${idx + 1}`).join('\n\n'),
        criteriosAvaliacao: items.map(it => it.criteriosAvaliacao).filter(Boolean).join('\n')
      }];
    }

    return items.map(it => ({
      enunciado: it.enunciado?.replace(/\*\*/g, '').replace(/[#{}]/g, '').trim() || '',
      criteriosAvaliacao: it.criteriosAvaliacao?.replace(/\*\*/g, '').replace(/[#{}]/g, '').trim() || ''
    }));
  } catch (error) {
    console.error('❌ Falha ao gerar atividade:', error);
    return [{
      enunciado: `Atividade sobre ${tema}.`,
      criteriosAvaliacao: `Avaliar compreensão do tema.`
    }];
  }
}

export async function gerarDisciplina(anoSerie: string, tema: string) {
  const prompt = `
=== GESTOR PEDAGÓGICO IA ===
Crie uma disciplina profissional e estruturada.

- Etapa: ${anoSerie}
- Foco Principal: ${tema} (Integrar com Cultura Digital e BNCC)

=== REGRAS OBRIGATÓRIAS ===
1. PROIBIDO markdown (** ou ###). Use texto limpo.
2. Seja profissional e inspirador.
3. No campo "sugestoesUnidades", forneça 3 temas de unidades que cubram o semestre.

=== ESTRUTURA JSON ===
{
  "nome": "Título da Disciplina",
  "descricao": "Texto curto e denso explicando o valor pedagógico desta disciplina.",
  "sugestoesUnidades": [
    { "tema": "Tema 1", "objetivo": "Objetivo detalhado..." },
    { "tema": "Tema 2", "objetivo": "Objetivo detalhado..." },
    { "tema": "Tema 3", "objetivo": "Objetivo detalhado..." }
  ]
}

RESPOSTA (APENAS O JSON):`;
  try {
    const res = await gerarComRetry(prompt);
    const jsonMatch = res.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Falha ao encontrar JSON');

    const parsed = JSON.parse(jsonMatch[0]);
    const cleanText = (str: string) => str.replace(/\*\*/g, '').replace(/###/g, '').trim();

    return {
      nome: cleanText(parsed.nome || `Disciplina: ${tema}`),
      descricao: cleanText(parsed.descricao || ''),
      sugestoesUnidades: (parsed.sugestoesUnidades || []).map((u: any) => ({
        tema: cleanText(u.tema || ''),
        objetivo: cleanText(u.objetivo || '')
      }))
    };
  } catch (e) {
    return { nome: `Disciplina: ${tema}`, descricao: `Foco em Cultura Digital para ${anoSerie}.`, sugestoesUnidades: [] };
  }
}

export async function sugerirUnidades(disciplina: string, anoSerie: string = '', quantidade = 3) {
  const fw = getFramework(anoSerie);
  const prompt = `
=== CONSULTOR PEDAGÓGICO (INICIALIZADOR DE CURRÍCULO) ===
Sugira ${quantidade} temas de unidades inovadores alinhados à BNCC e Cultura Digital.

- Disciplina: "${disciplina}"
- Etapa: ${fw.etapa}

=== REGRAS CRÍTICAS ===
1. RIGOR: Cada tema deve ter um objetivo DENSE e PROFISSIONAL.
2. BNCC: Inclua a RECOMENDAÇÃO do CÓDIGO DA HABILIDADE BNCC no objetivo (ex: [EF05LP20]).
3. PROIBIDO: Markdown (** ou ###) ou chaves/colchetes soltos.
4. DIFERENCIAÇÃO: Use temas específicos para ${fw.etapa}.

=== ESTRUTURA JSON (ARRAY) ===
[
  { "tema": "Título do Tema", "objetivo": "Objetivo pedagógico detalhado + [CÓDIGO BNCC RECOMENDADO]" }
]

RESPOSTA (APENAS O ARRAY JSON):`;

  console.log(`[sugerirUnidades] Buscando sugestões DENSAS para: ${disciplina} (${fw.etapa})`);

  try {
    const res = await gerarComRetry(prompt);
    const jsonMatch = res.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('JSON não encontrado');

    const parsed = JSON.parse(jsonMatch[0]);
    const cleanText = (str: string) => str.replace(/\*\*/g, '').replace(/###/g, '').trim();

    return parsed.map((item: any) => ({
      tema: cleanText(item.tema || ''),
      objetivo: cleanText(item.objetivo || '')
    }));
  } catch (e: any) {
    console.error('❌ Erro em sugerirUnidades:', e.message);
    return [
      { tema: `Fundamentos de ${disciplina}`, objetivo: `Explorar os conceitos essenciais de ${disciplina} aplicados à ${fw.etapa}.` },
      { tema: `Inovação e ${disciplina}`, objetivo: `Desenvolver competências críticas e práticas em ${disciplina}.` },
      { tema: `Desafios Contemporâneos`, objetivo: `Analisar o impacto de ${disciplina} na sociedade digital.` }
    ];
  }
}