// src/services/geracao.service.slides.ts
/**
 * Serviço para gerar slides educacionais usando IA (Google Gemini)
 */

import { gerarTextoComIA } from './ai-gemini.service';
import { gerarComRetry } from './geracao.service';
import { getBnccText } from '../utils/bncc';

async function getBnccSnippet() {
  return await getBnccText();
}

/**
 * RF06 - Gerar slides para unidade de ensino
 * Retorna conteúdo em formato Markdown pronto para apresentação
 */
const FRAMEWORK_SLIDES = {
  FUND_I: {
    estilo: 'Lúdico, alfabetização inicial, coordenação motora direta.',
    animacoes: {
      entradas: '"Pular suave" (bounce) para personagens (0.8s), "Girar 360°" para elementos-chave, "Zoom suave de 110% a 100%"',
      transicoes: '"Empurrar para direita" com som de "whoosh" leve, "Cortina de estrelinhas" (0.6s)',
      interacoes: 'Ao clicar: "pisca 2x" + som de "pling!", Destaque: borda colorida que "pulsa" 1x'
    },
    cores: 'Fundo: amarelo-bebê (#FFF9C4) ou azul-claro (#E3F2FD). Destaque: laranja (#FF9800), verde-limão (#CDDC39), rosa-choque (#E91E63)',
    obrigatorios: 'Personagens redondeados, ícones de materiais reais (tesoura ✂️, cola 🧴), setas em "rastro de formiga".'
  },
  FUND_II: {
    estilo: 'Interativo, contextualizado, pegada redes sociais (TikTok educativo).',
    animacoes: {
      entradas: '"Fade suave" (0.5s) + "deslizar de baixo para cima", delay de 0.2s entre elementos',
      transicoes: '"Morphing" suave entre conceitos, "Zoom panorâmico"',
      interacoes: 'Hover: sombra suave + scale 1.03, Clique: mudança de cor + mini-ícone de "check"'
    },
    cores: 'Fundo: branco ou cinza claro (#FAFAFA). Destaque: azul-turquesa (#00BCD4), roxo (#9C27B0), verde (#4CAF50)',
    obrigatorios: 'Ícones flat design, infográficos minimalistas, espaço para escolha do aluno.'
  },
  MEDIO: {
    estilo: 'Profissional, acadêmico, foco em ENEM e mercado de trabalho.',
    animacoes: {
      entradas: 'Fade simples (0.3s) SEM excessos, apenas em fórmulas/elementos-chave',
      transicoes: 'Fade elegante ou corte seco (profissional)',
      interacoes: 'Destaque por contraste, animação só com propósito didático'
    },
    cores: 'Fundo: branco ou off-white (#FDFDFD). Destaque: coral (#FF6B6B) + tons neutros',
    obrigatorios: 'Gráficos com dados reais, citações de especialistas, conexão ENEM.'
  }
};

function getSlideFramework(anoSerie: string = '') {
  const s = anoSerie.toLowerCase();
  if (s.includes('médio') || s.includes('3º') || s.includes('ensino médio')) return FRAMEWORK_SLIDES.MEDIO;
  if (s.includes('6') || s.includes('7') || s.includes('8') || s.includes('9')) return FRAMEWORK_SLIDES.FUND_II;
  return FRAMEWORK_SLIDES.FUND_I;
}

export async function gerarSlides(tema: string, disciplina: string, anoSerie: string = '') {
  console.log(`[geracao.service] gerarSlides: tema=${tema} disciplina=${disciplina} anoSerie=${anoSerie}`);

  const bncc = await getBnccSnippet();
  const fw = getSlideFramework(anoSerie);

  const prompt = `
=== CONTEXTO ===
Você é um DESIGNER INSTRUCIONAL ESPECIALISTA EM PEDAGOGIA. 
Etapa de Ensino: ${fw.estilo}

=== MISSÃO ===
Crie uma APRESENTAÇÃO DE SLIDES sobre "${tema}" para "${disciplina}".

=== DIRETRIZES DE DESIGN (OBRIGATÓRIO) ===
- CORES HEX: ${fw.cores}
- ELEMENTOS VISUAIS: ${fw.obrigatorios}
- ANIMAÇÕES RECOMENDADAS NO ROTEIRO:
  * Entradas: ${fw.animacoes.entradas}
  * Transições: ${fw.animacoes.transicoes}
  * Interações: ${fw.animacoes.interacoes}

=== REQUISITOS ===
1. QUANTIDADE: 8-10 slides.
2. DIFERENCIAÇÃO: Conteúdo adequado à maturidade da turma.
3. PRÁTICA: Incluir 2 atividades práticas com materiais reais no roteiro.

=== ESTRUTURA DO CONTEÚDO ===
No campo "conteudo", além do texto pedagógico, inclua uma seção "ROTEIRO DE ANIMAÇÃO" descrevendo quais animações e cores usar de acordo com as diretrizes acima.

RETORNE APENAS JSON (ARRAY):
[
  {
    "numero": 1,
    "titulo": "Título",
    "conteudo": "Texto Pedagógico... \\n\\nROTEIRO DE ANIMAÇÃO: [Descreva animações e tons HEX]",
    "tipo": "titulo|conteudo|pratica|questao|conclusao",
    "icon": "nome-do-icone"
  }
]
`;

  try {
    const respostaBruta = await gerarComRetry(prompt);
    console.log('[geracao.service] slides response received');

    const firstBracket = respostaBruta.indexOf('[');
    const lastBracket = respostaBruta.lastIndexOf(']');

    if (firstBracket === -1 || lastBracket === -1) {
      throw new Error('JSON não encontrado na resposta dos slides');
    }

    const jsonStr = respostaBruta.substring(firstBracket, lastBracket + 1);
    const slides = JSON.parse(jsonStr);

    if (!Array.isArray(slides)) throw new Error('Resposta não é um array');

    console.log('[geracao.service] slides gerados:', slides.length);
    return slides;
  } catch (error) {
    console.error('❌ Erro ao gerar slides:', error);

    // Fallback com slides básicos
    return [
      {
        numero: 1,
        titulo: tema,
        conteudo: `Apresentação sobre ${tema}\\n\\nDisciplina: ${disciplina}${anoSerie ? `\\nAno/Série: ${anoSerie}` : ''}`,
        tipo: 'titulo'
      },
      {
        numero: 2,
        titulo: 'Objetivo da Aula',
        conteudo: `- Compreender conceitos de ${tema}\\n- Desenvolver pensamento crítico\\n- Aplicar conhecimentos na prática`,
        tipo: 'conteudo'
      },
      {
        numero: 3,
        titulo: 'Contextualização',
        conteudo: `${tema} é fundamental para:\\n- Formação cidadã\\n- Uso consciente de tecnologias\\n- Desenvolvimento de competências BNCC`,
        tipo: 'conteudo'
      },
      {
        numero: 4,
        titulo: 'Reflexão',
        conteudo: `Como você aplica ${tema} no seu dia a dia?\\n\\nQual a importância para a sociedade?`,
        tipo: 'questao'
      },
      {
        numero: 5,
        titulo: 'Conclusão',
        conteudo: `- Revisão dos conceitos-chave\\n- Aplicação prática\\n- Próximos passos`,
        tipo: 'conclusao'
      }
    ];
  }
}
