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

/**
 * Extrai trechos relevantes da BNCC com base no tema
 */
async function extrairTrechoRelevanteBNCC(tema: string): Promise<string> {
  const bncc = await getBnccText();

  // Palavras-chave por tema (ajuste conforme necessário)
  const mapaTemas: Record<string, string[]> = {
    'fake news': ['desinformação', 'verificação', 'fontes', 'confiabilidade'],
    'segurança': ['privacidade', 'senha', 'dados', 'proteção'],
    'cidadania': ['ética', 'respeito', 'direitos', 'convivência'],
    'cultura digital': ['tecnologias', 'comunicação', 'informação', 'ética'],
    'pensamento computacional': ['algoritmos', 'padrões', 'decomposição', 'lógica']
  };

  const palavrasChave = mapaTemas[tema.toLowerCase()] || [tema];
  const trechos: string[] = [];

  for (const palavra of palavrasChave) {
    const idx = bncc.toLowerCase().indexOf(palavra.toLowerCase());
    if (idx > -1) {
      const inicio = Math.max(0, idx - 300);
      const fim = Math.min(bncc.length, idx + 600);
      const trecho = bncc.substring(inicio, fim);
      trechos.push(trecho);
    }
  }

  return trechos.join('\n\n').substring(0, 2000); // Limita a 2000 caracteres
}

/**
 * Framework pedagógico por etapa escolar
 */
const FRAMEWORK_PEDAGOGICO = {
  FUND_I: {
    etapa: 'Ensino Fundamental I (1º ao 5º ano)',
    foco: 'Ludicidade, alfabetização inicial, coordenação motora direta.',
    materiais: 'Tesoura ✂️, cola 🧴, EVA, massinha, caixa surpresa.',
    tempo: '10 a 15 min',
    linguagem: 'Frases curtas, verbos de ação ("vamos construir", "descobrir juntos")'
  },
  FUND_II: {
    etapa: 'Ensino Fundamental II (6º ao 9º ano)',
    foco: 'Experimentos, metodologias ativas, pegada TikTok educativo.',
    materiais: 'QR Codes, materiais recicláveis, jogos customizados.',
    tempo: '20 a 30 min',
    linguagem: 'Termos do cotidiano, desafios práticos, storytelling digital'
  },
  MEDIO: {
    etapa: 'Ensino Médio',
    foco: 'Análise crítica, ética complexa, carreira e ENEM.',
    materiais: 'Estudos de caso reais, simulações, cartões de debate.',
    tempo: '45 a 50 min',
    linguagem: 'Terminologia técnica, dilemas éticos, debates estruturados'
  }
};

function getFramework(anoSerie: string = '') {
  const s = anoSerie.toLowerCase();
  if (s.includes('médio') || s.includes('3º') || s.includes('ensino médio')) return FRAMEWORK_PEDAGOGICO.MEDIO;
  if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9')) return FRAMEWORK_PEDAGOGICO.FUND_II;
  return FRAMEWORK_PEDAGOGICO.FUND_I;
}

export interface PlanoAula {
  planoDeAula: string;
  objetivo: string;
  metodologia: string;
  meta: string;
  atividade: string;
  tempoEstimado: string;
  inclusao: string;
  habilidadesBNCC: Array<{ codigo: string; descricao: string }>;
}

/**
 * Gera um plano de aula com RAG avançado da BNCC
 */
export async function gerarConteudo(
  disciplina: string,
  tema: string,
  anoSerie: string = ''
): Promise<PlanoAula> {
  console.log(`[gerarConteudo] Gerando plano para: ${tema} | ${disciplina} | ${anoSerie}`);

  // Carrega trecho relevante da BNCC
  let trechoBNCC = '';
  try {
    trechoBNCC = await extrairTrechoRelevanteBNCC(tema);
  } catch (e) {
    console.warn('[gerarConteudo] Falha ao carregar BNCC, usando fallback');
    trechoBNCC = `BNCC para ${disciplina} - ${anoSerie}: Habilidades gerais de Cultura Digital e pensamento computacional.`;
  }

  // Seleciona framework pedagógico
  const fw = getFramework(anoSerie);

  // Prompt avançado com RAG da BNCC
  const prompt = `
# 🎯 MESTRE PEDAGÓGICO SENIOR (40 ANOS DE EXPERIÊNCIA)
Você é um **especialista sênior em pedagogia e BNCC**, com 40 anos de experiência.
Sua missão: gerar um **plano de aula impecável**, com **RAG da BNCC** e **profundidade técnica**.

## 📌 CONTEXTO DE ENTRADA
- Disciplina: "${disciplina}"
- Tema: "${tema}"
- Etapa: "${anoSerie}" → ${fw.etapa}
- Estilo: ${fw.foco}

## 📚 BASE DE CONHECIMENTO (RAG da BNCC - Trecho Relevante)
${trechoBNCC}

## 🧩 EXIGÊNCIAS OBRIGATÓRIAS (NÃO NEGOCIÁVEIS)
1. **HABILIDADES BNCC REAIS**: Use APENAS habilidades que estejam no trecho acima (ex: EF08CI01, EM13CO14). NÃO invente.
2. **ESTRUTURA PEDAGÓGICA**:
   - INÍCIO (5-10 min): Gatilho + conexão com vivência prévia
   - DESENVOLVIMENTO (20-35 min): 2-3 atividades PRÁTICAS com materiais específicos
   - ENCERRAMENTO (5-10 min): Síntese + produto + conexão próxima aula
3. **ADEQUAÇÃO À ETAPA**: Use linguagem, materiais e tempo compatíveis com ${fw.etapa}.
4. **ESTRATÉGIAS MEC**: Inclua 3 das 13 estratégias pedagógicas (cite os nomes).
5. **EIXOS CULTURA DIGITAL**: Inclua 2 dos 5 eixos (cite os nomes).
6. **INCLUSÃO**: Adicione 1 adaptação prática para alunos com necessidades especiais.

## 📦 FORMATO DE SAÍDA (APENAS JSON VÁLIDO)
{
  "objetivo": "Objetivo claro com verbos de Bloom. Max 2 frases.",
  "inicio": "Detalhes da fase inicial (atividades, tempo, estratégias).",
  "desenvolvimento": "2-3 atividades práticas com materiais, estratégias MEC (3) e eixos CD (2).",
  "encerramento": "Síntese + produto gerado + conexão próxima aula.",
  "recursos": ["Lista de materiais específicos, não genéricos"],
  "tempoTotal": "Ex: 2 aulas de 50 min",
  "meta": "Habilidades BNCC: EF08CI01, EM13CO14 | Eixos CD: Cidadania Digital, Segurança | Estratégias: Investigação, Experimentação",
  "inclusao": "Adaptação prática para alunos com necessidades especiais.",
  "habilidadesBNCC": [
    { "codigo": "EF08CI01", "descricao": "Identificar e classificar diferentes fontes de informação digital." },
    { "codigo": "EM13CO14", "descricao": "Avaliar a confiabilidade das informações em meio digital." }
  ]
}

## 🚫 NUNCA FAÇA
- Use markdown (**, ###, [], {})
- Inclua texto antes/depois do JSON
- Invente habilidades da BNCC
- Use linguagem inadequada para ${fw.etapa}

## ✅ FAÇA SEMPRE
- Seja técnico, direto e profundo
- Use nomes reais de habilidades da BNCC acima
- Cite estratégias MEC e eixos CD
- Dê exemplos práticos de materiais

RESPOSTA (APENAS O JSON, NADA ANTES/DEPOIS):
`;

  try {
    const respostaBruta = await gerarComRetry(prompt, 2);

    // Extrai JSON da resposta
    const firstBrace = respostaBruta.indexOf('{');
    const lastBrace = respostaBruta.lastIndexOf('}');
    if (firstBrace === -1 || lastBrace === -1) throw new Error('JSON não encontrado na resposta');

    const jsonStr = respostaBruta.substring(firstBrace, lastBrace + 1);
    const c = JSON.parse(jsonStr);

    // Função auxiliar para limpar texto
    const clean = (val: any): string => {
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
      meta: clean(c.meta),
      atividade: clean(c.encerramento),
      tempoEstimado: clean(c.tempoTotal || c.tempoEstimado),
      inclusao: clean(c.inclusao),
      habilidadesBNCC: c.habilidadesBNCC || []
    };
  } catch (error: any) {
    console.error('❌ Erro em gerarConteudo robusto:', error.message);
    return {
      planoDeAula: `ERRO: ${tema}`,
      objetivo: `Desenvolver competências críticas sobre ${tema} com foco em Cultura Digital.`,
      metodologia: `INÍCIO: Contextualização com exemplo do cotidiano.\n\nDESENVOLVIMENTO: Atividade prática com materiais concretos.\n\nENCERRAMENTO: Reflexão coletiva e produção de regra de convivência digital.`,
      meta: `BNCC: Habilidades gerais | Eixos CD: Cidadania Digital, Segurança | Estratégias: Investigação, Experimentação`,
      atividade: `Produção de cartaz com regras para uso seguro da internet.`,
      tempoEstimado: '50 min',
      inclusao: `Oferecer suporte visual e verbal individualizado.`,
      habilidadesBNCC: []
    };
  }
}

/**
 * Gera atividades avaliativas com base no tema
 */
export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  const fw = getFramework(anoSerie);
  const prompt = `
=== MASTER EDUCADOR IA: GERAÇÃO DE ATIVIDADES AVALIATIVAS ===
Você é um especialista em avaliação educacional. Crie uma atividade TÉCNICA, PROFISSIONAL e DESAFIADORA.

--- DADOS DA ATIVIDADE ---
- Tema: "${tema}"
- Tipo: "${tipo}"
- Público-alvo: "${anoSerie}" (Estilo: ${fw.linguagem})

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

/**
 * Gera sugestões de unidades por disciplina e etapa
 */
export async function sugerirUnidades(disciplina: string, anoSerie: string = '', quantidade = 3) {
  const fw = getFramework(anoSerie);
  const trechoBNCC = await extrairTrechoRelevanteBNCC(disciplina);

  const prompt = `
=== CONSULTOR PEDAGÓGICO (INICIALIZADOR DE CURRÍCULO) ===
Sugira ${quantidade} temas de unidades inovadores alinhados à BNCC e Cultura Digital.

- Disciplina: "${disciplina}"
- Etapa: ${fw.etapa}
- Base: ${trechoBNCC.substring(0, 500)}

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

/**
 * Gera slides educacionais com base no tema, disciplina e ano/série
 * Esta função foi adicionada para manter compatibilidade com as rotas
 */
export async function gerarSlides(tema: string, disciplina: string, anoSerie: string = '') {
  console.log(`[geracao.service.slides] gerarSlides: tema=${tema} disciplina=${disciplina} anoSerie=${anoSerie}`);

  const FRAMEWORK_SLIDES = {
    FUND_I: {
      estilo: 'Lúdico, visual atrativo, linguagem simples, personagens fofos, cores vivas.',
      elementos: 'Ícones reais (tesoura ✂️, cola 🧴), mascotes, setas com "rastro de formiga".',
      linguagem: 'Frases curtas, verbos de ação ("vamos descobrir", "vamos construir").',
      tempo: 'Máximo 15 minutos por atividade.',
      exemplos_habilidades: ['EI02CG05', 'EF03LP01']
    },
    FUND_II: {
      estilo: 'Interativo, contextualizado, inspirado em redes sociais (TikTok educativo), infográficos.',
      elementos: 'QR Codes, vídeos curtos, gráficos simples, botões de interação.',
      linguagem: 'Termos do cotidiano, desafios práticos, storytelling digital.',
      tempo: '20-30 minutos por atividade.',
      exemplos_habilidades: ['EF08CI01', 'EF09LP20']
    },
    MEDIO: {
      estilo: 'Profissional, acadêmico, foco em ENEM e mercado de trabalho, dados reais.',
      elementos: 'Gráficos com dados IBGE, estudos de caso, conexões com vestibulares.',
      linguagem: 'Terminologia técnica, dilemas éticos, debates estruturados.',
      tempo: '45-50 minutos por aula.',
      exemplos_habilidades: ['EM13CO14', 'EM13LP09']
    }
  };

  function getSlideFramework(anoSerie: string = '') {
    const s = anoSerie.toLowerCase();
    if (s.includes('médio') || s.includes('3º') || s.includes('ensino médio') || s.includes('2º') || s.includes('1º')) {
      return FRAMEWORK_SLIDES.MEDIO;
    }
    if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9')) {
      return FRAMEWORK_SLIDES.FUND_II;
    }
    return FRAMEWORK_SLIDES.FUND_I;
  }

  const fw = getSlideFramework(anoSerie);

  const prompt = `
# DESIGNER INSTRUCIONAL IA (SLIDES EDUCACIONAIS + BNCC)

## 📌 OBJETIVO
Você é um designer instrucional especializado em **Cultura Digital** e **BNCC**. Gere uma apresentação de slides **pedagogicamente sólida**, **diferenciada por etapa** e **com habilidades reais da BNCC**.

## 🎯 DADOS DO SLIDE
- Tema: "${tema}"
- Disciplina: "${disciplina}"
- Etapa: "${anoSerie}"
- Estilo: ${fw.estilo}

## 📚 BASE BNCC (trecho relevante)
${(await extrairTrechoRelevanteBNCC(tema)).substring(0, 1000)}

## 🎨 REQUISITOS POR ETAPA
### Ensino Fundamental I:
- Linguagem: ${fw.linguagem}
- Elementos: ${fw.elementos}
- Tempo: ${fw.tempo}
- Habilidades: Ex: ${fw.exemplos_habilidades.join(', ')}

### Ensino Fundamental II:
- Linguagem: ${fw.linguagem}
- Elementos: ${fw.elementos}
- Tempo: ${fw.tempo}
- Habilidades: Ex: ${fw.exemplos_habilidades.join(', ')}

### Ensino Médio:
- Linguagem: ${fw.linguagem}
- Elementos: ${fw.elementos}
- Tempo: ${fw.tempo}
- Habilidades: Ex: ${fw.exemplos_habilidades.join(', ')}

## 📦 FORMATO DE RESPOSTA (APENAS JSON)
[
  {
    "numero": 1,
    "titulo": "Título envolvente para o tema",
    "conteudo": "Texto adequado ao nível de ensino. \\n\\n[ROTEIRO PROFESSOR]: Dicas de fala e dinâmica.",
    "tipo": "titulo|conteudo|atividade|reflexao|conclusao",
    "habilidadesBNCC": ["EF08CI01", "EM13CO14"], // Apenas se relevante
    "icone": "ícone lucide relacionado (ex: lightbulb, users, globe)"
  }
]

## ⚠️ REGRAS
- Proibido conteúdo genérico
- Use linguagem adequada à etapa
- Cite habilidades reais da BNCC no slide final
- Evite markdown (#, **, etc)

RESPOSTA (APENAS O ARRAY JSON):
`;

  try {
    const respostaBruta = await gerarComRetry(prompt);
    const firstBracket = respostaBruta.indexOf('[');
    const lastBracket = respostaBruta.lastIndexOf(']');
    if (firstBracket === -1 || lastBracket === -1) throw new Error('JSON não encontrado');

    const jsonStr = respostaBruta.substring(firstBracket, lastBracket + 1);
    const slides = JSON.parse(jsonStr);

    const clean = (val: string) => val.replace(/\*\*/g, '').replace(/[#{}]/g, '').trim();

    return slides.map((s: any) => ({
      ...s,
      titulo: clean(s.titulo || ''),
      conteudo: clean(s.conteudo || '')
    }));
  } catch (error) {
    console.error('❌ Erro ao gerar slides:', error);

    // Fallback com slides diferenciados por etapa
    const fw = getSlideFramework(anoSerie);
    return [
      {
        numero: 1,
        titulo: `Introdução: ${tema}`,
        conteudo: `Vamos aprender sobre ${tema}!\n\n[ROTEIRO PROFESSOR]: Inicie com uma pergunta provocadora.`,
        tipo: 'titulo',
        icone: 'book-open'
      },
      {
        numero: 2,
        titulo: 'O que é?',
        conteudo: fw.linguagem.includes('Frases curtas')
          ? `Descubra o que é ${tema} de forma divertida!`
          : `Entenda o conceito de ${tema} e sua importância.`,
        tipo: 'conteudo',
        icone: 'info'
      },
      {
        numero: 3,
        titulo: 'Aplicação Prática',
        conteudo: fw.linguagem.includes('Frases curtas')
          ? `Vamos praticar juntos!`
          : `Como aplicar ${tema} no dia a dia?`,
        tipo: 'atividade',
        icone: 'clipboard-list'
      },
      {
        numero: 4,
        titulo: 'Reflexão Final',
        conteudo: `O que aprendemos hoje?\n\n[ROTEIRO PROFESSOR]: Promova uma roda de conversa.`,
        tipo: 'reflexao',
        icone: 'refresh-cw'
      },
      {
        numero: 5,
        titulo: 'Habilidades Trabalhadas',
        conteudo: `BNCC: ${fw.exemplos_habilidades.join(', ')}\n\nConexão com a Cultura Digital.`,
        tipo: 'conclusao',
        icone: 'award'
      }
    ];
  }
}