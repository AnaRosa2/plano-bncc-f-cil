// src/services/geracao.service.ts
import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

/**
 * Função utilitária para tentar gerar texto com retry
 */
export async function gerarComRetry(prompt: string, maxRetries = 2): Promise<string> {
  let lastError: any;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await gerarTextoComIA(prompt);
    } catch (error) {
      console.warn(`[geracao.service] Tentativa ${i + 1} falhou.`, error);
      lastError = error;
      if (i < maxRetries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

// === FRAMEWORK PEDAGÓGICO (FORA DA FUNÇÃO - CORRIGIDO) ===
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

// === FUNÇÃO getFramework (FORA - CORRIGIDO) ===
function getFramework(anoSerie: string = '') {
  const s = anoSerie.toLowerCase();
  if (s.includes('médio') || s.includes('3º') || s.includes('ensino médio') || s.includes('3')) return FRAMEWORK_PEDAGOGICO.MEDIO;
  if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9')) return FRAMEWORK_PEDAGOGICO.FUND_II;
  return FRAMEWORK_PEDAGOGICO.FUND_I;
}

// === FUNÇÃO PRINCIPAL CORRIGIDA ===
export async function gerarConteudo(disciplina: string, tema: string, anoSerie: string = '', metodologiaId?: string) {
  // Carrega BNCC com fallback seguro
  let bncc = '';
  try {
    bncc = await getBnccText();
  } catch (e) {
    console.warn('[gerarConteudo] Falha ao carregar BNCC, usando fallback');
    bncc = `BNCC para ${disciplina} - ${anoSerie}: Habilidades gerais de Cultura Digital e pensamento computacional.`;
  }

  const fw = getFramework(anoSerie);

  // === 13 ESTRATÉGIAS PEDAGÓGICAS DO MEC ===
  const ESTRATEGIAS_MEC = `
1. Investigação (questionamento guiado)
2. Experimentação (mãos na massa)
3. Colaboração (trabalho em grupo)
4. Mediação (professor como facilitador)
5. Contextualização (conexão com realidade)
6. Interdisciplinaridade (ligação com outras disciplinas)
7. Resolução de Problemas (desafios reais)
8. Aprendizagem Baseada em Projetos (ABP)
9. Gamificação (elementos lúdicos com propósito)
10. Storytelling (narrativas envolventes)
11. Aprendizagem Híbrida (presencial + digital)
12. Pensamento Computacional (decomposição, padrões, algoritmos)
13. Alfabetização Midiática (crítica à informação digital)
`;

  // === 5 EIXOS CULTURA DIGITAL (MEC) ===
  const EIXOS_CD = `
Eixo 1: Cidadania e Ética Digital
Eixo 2: Pensamento Computacional
Eixo 3: Cultura Digital e Mídias
Eixo 4: Dados e Informação
Eixo 5: Segurança e Privacidade
`;

  // === DIFERENCIAÇÃO POR ETAPA ===
  const diferenciacao = fw === FRAMEWORK_PEDAGOGICO.MEDIO
    ? `
=== ENSINO MÉDIO: EXIGÊNCIA DE PROFUNDIDADE TÉCNICA ===
- USE terminologia avançada da disciplina (ex: para História: "hegemonia cultural", "pós-verdade", "algoritmos de recomendação")
- CONECTE com ENEM: cite competências específicas da matriz
- PROBLEMATIZE: apresente dilemas reais (ex: "Como algoritmos reforçam bolhas informativas?")
- ATIVIDADE EXIGIDA: Estudo de caso com dados reais (IBGE, TIC Educação) + debate estruturado
`
    : fw === FRAMEWORK_PEDAGOGICO.FUND_II
    ? `
=== ENSINO FUNDAMENTAL II: EQUILÍBRIO ENTRE TÉCNICA E PRÁTICA ===
- USE termos conceituais da disciplina (ex: "cadeia alimentar digital", "pegada de carbono de dados")
- CONECTE com cotidiano: mostre como o tema impacta a vida do aluno
- ATIVIDADE EXIGIDA: Experimento com materiais recicláveis + QR Code para simulador interativo
- TEMPO: 20-30 min por fase
`
    : `
=== ENSINO FUNDAMENTAL I: LUDICIDADE COM PROPÓSITO PEDAGÓGICO ===
- EVITE abstração: use analogias concretas (ex: "Internet é como uma biblioteca gigante")
- LINGUAGEM: frases curtas, verbos de ação ("vamos construir", "descobrir juntos")
- ATIVIDADE EXIGIDA: Caixa surpresa com objetos que representam conceitos
- MATERIAL: Tesoura de ponta redonda, EVA, massinha — NADA abstrato
- TEMPO: máximo 15 min por atividade
`;

  let metodologiaContexto = '';
  if (metodologiaId) {
    const { METODOLOGIAS_ATIVAS } = require('../constants/metodologias');
    const meto = METODOLOGIAS_ATIVAS.find((m: any) => m.id === metodologiaId);
    if (meto) {
      metodologiaContexto = `
=== METODOLOGIA ATIVA SELECIONADA ===
${meto.nome.toUpperCase()}
${meto.descricao}
${meto.fases ? `FASES OBRIGATÓRIAS: ${meto.fases.join(' → ')}` : ''}
→ ADAPTE RIGOROSAMENTE TODO O PLANO PARA ESTA METODOLOGIA.
`;
    }
  }

  const prompt = `
# MESTRE PEDAGÓGICO IA: GERADOR DE PLANOS DE AULA BNCC + CULTURA DIGITAL

## 📌 CONTEXTO
Você é um especialista sênior em pedagogia com 20+ anos de experiência. Sua tarefa é gerar um plano de aula **PROFUNDO, TÉCNICO E DIFERENCIADO**.

## 🎯 DADOS DA SOLICITAÇÃO
- Disciplina: "${disciplina}"
- Tema: "${tema}"
- Etapa/Ano: "${anoSerie}"
- Base Legal: BNCC + Diretrizes MEC para Cultura Digital

## ⚙️ EXIGÊNCIAS TÉCNICAS (NÃO NEGOCIÁVEIS)
${diferenciacao}

### ESTRUTURA PEDAGÓGICA OBRIGATÓRIA
1. INÍCIO (5-10 min): Gatilho emocional/conceitual + conexão com vivência prévia
2. DESENVOLVIMENTO (20-35 min): 2-3 atividades PRÁTICAS sequenciais com materiais específicos
3. ENCERRAMENTO (5-10 min): Síntese coletiva + produto tangível gerado

## 📚 BASES CURRICULARES
BNCC Relevante:
${bncc.slice(0, 800)}

13 Estratégias Pedagógicas MEC:
${ESTRATEGIAS_MEC}

5 Eixos Cultura Digital (MEC):
${EIXOS_CD}

${metodologiaContexto}

## 🚫 PROIBIDO
- Conteúdo genérico ("vamos aprender sobre internet")
- Listas sem contexto
- Termos vagos ("atividade divertida")
- Markdown (**, #, ###) ou colchetes extras

## ✅ EXIGIDO
- Termos técnicos DA DISCIPLINA
- Exemplos CONCRETOS de atividades
- Tempo explícito por fase
- Materiais específicos e acessíveis
- Adaptação para inclusão (1 frase prática)

## 📦 SAÍDA JSON (APENAS O JSON)
{
  "objetivo": "Objetivo claro usando verbos de Bloom. Máx 2 frases.",
  "inicio": "Descrição detalhada da fase de início (5-10 min). Incluir gatilho + conexão prévia.",
  "desenvolvimento": "2-3 atividades PRÁTICAS sequenciais com materiais específicos, estratégias pedagógicas usadas (cite 3) e eixos CD (cite 2).",
  "encerramento": "Síntese coletiva + produto tangível gerado + conexão com próxima aula.",
  "recursos": "Lista específica: 'Tablet com app X', 'Cartolina colorida'. Nada genérico.",
  "tempoTotal": "Ex: '2 aulas de 50 min'",
  "meta": "Habilidades BNCC (códigos) + Eixos Cultura Digital (nomes) + Estratégias Pedagógicas (nomes). TEXTO LIMPO.",
  "inclusao": "1 adaptação prática para alunos com dificuldades."
}

RESPOSTA (APENAS O JSON, NADA ANTES/DEPOIS):
`;

  console.log(`[gerarConteudo] Gerando plano PROFUNDO para: ${tema} (${anoSerie})`);

  try {
    const respostaBruta = await gerarComRetry(prompt, 2);
    const firstBrace = respostaBruta.indexOf('{');
    const lastBrace = respostaBruta.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error('JSON não encontrado na resposta');

    const jsonStr = respostaBruta.substring(firstBrace, lastBrace + 1);
    const c = JSON.parse(jsonStr);

    const clean = (val: any) => {
      if (!val) return '';
      let s = typeof val === 'string' ? val : (Array.isArray(val) ? val.join(', ') : JSON.stringify(val));
      return s
        .replace(/\*\*/g, '')
        .replace(/###/g, '')
        .replace(/\\n/g, '\n')
        .replace(/\[|\]/g, '')
        .trim();
    };

    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: clean(c.objetivo),
      metodologia: `INÍCIO:\n${clean(c.inicio)}\n\nDESENVOLVIMENTO:\n${clean(c.desenvolvimento)}\n\nENCERRAMENTO:\n${clean(c.encerramento)}`,
      recursos: clean(c.recursos),
      meta: clean(c.meta),
      atividade: clean(c.encerramento),
      tempoEstimado: clean(c.tempoTotal || c.tempoEstimado),
      inclusao: clean(c.inclusao),
      metodologiaId
    };
  } catch (error: any) {
    console.error('❌ Erro em gerarConteudo robusto:', error.message);
    return {
      planoDeAula: `Plano: ${tema}`,
      objetivo: `Desenvolver competências críticas sobre ${tema} with foco em Cultura Digital.`,
      metodologia: `INÍCIO: Contextualização com exemplo do cotidiano.\n\nDESENVOLVIMENTO: Atividade prática com materiais concretos.\n\nENCERRAMENTO: Reflexão coletiva e produção de regra de convivência digital.`,
      recursos: `Materiais básicos + dispositivo com acesso à internet.`,
      meta: `BNCC: Habilidades gerais | Eixos CD: Cidadania Digital, Segurança | Estratégias: Investigação, Experimentação, Colaboração`,
      atividade: `Produção de cartaz com regras para uso seguro da internet.`,
      tempoEstimado: '50 min',
      inclusao: `Oferecer suporte visual e verbal individualizado.`,
      metodologiaId
    };
  }
}

// === FUNÇÕES RESTANTES (sem alterações críticas) ===
export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  const prompt = `
=== MASTER EDUCADOR IA: GERAÇÃO DE ATIVIDADES AVALIATIVAS ===
Você é um especialista em avaliação educacional. Crie uma atividade TÉCNICA, PROFISSIONAL e DESAFIADORA.

--- DADOS DA ATIVIDADE ---
- Tema: "${tema}"
- Tipo: "${tipo}"
- Público-alvo: "${anoSerie}"

--- REGRAS DE OURO ---
1. QUALIDADE: Use terminologia técnica. Proponha situações-problema e análise crítica.
2. EXTENSÃO: Gere exatamente 10 questões (objetivas ou dissertativas) ou um roteiro de desafio prático com 10 etapas claras.
3. FORMATAÇÃO: PROIBIDO Markdown (#, **, ###) ou colchetes extras. Use TEXTO LIMPO.
4. INCLUSÃO: Adicione uma pequena nota técnica sobre como adaptar esta atividade para alunos com Dificuldades de Aprendizagem.

--- ESTRUTURA JSON OBRIGATÓRIA (ARRAY) ---
[
  {
    "enunciado": "1. [Questão/Etapa]... \\n\\n2. [Questão/Etapa]... \\n\\n(PROSSIGA ATÉ A 10)",
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
- Foco Principal: ${tema} (Integrar with Cultura Digital e BNCC)

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
  const { getFramework } = require('./geracao.service'); // self-reference for correct framework
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