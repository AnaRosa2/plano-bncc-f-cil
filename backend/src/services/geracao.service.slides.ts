// src/services/geracao.service.slides.ts
/**
 * Serviço para gerar slides educacionais usando IA (Google Gemini)
 */

import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

async function getBnccSnippet() {
  return await getBnccText();
}

/**
 * RF06 - Gerar slides para unidade de ensino
 * Retorna conteúdo em formato Markdown pronto para apresentação
 */
export async function gerarSlides(tema: string, disciplina: string, anoSerie?: string) {
  console.log(`[geracao.service] gerarSlides: tema=${tema} disciplina=${disciplina} anoSerie=${anoSerie}`);

  const bncc = await getBnccSnippet();

  const prompt = `
=== CONTEXTO ===
Você é um DESIGNER INSTRUCIONAL com especialização em criar apresentações educacionais impactantes e engajadoras. Você domina técnicas de storytelling educacional.

=== MISSÃO ===
Crie uma APRESENTAÇÃO DE SLIDES COMPLETA sobre "${tema}" para "${disciplina}"${anoSerie ? ` (${anoSerie})` : ''}.

=== REQUISITOS ===
1. QUANTIDADE: 8-10 slides (apresentação de 40-50 min)
2. NARRATIVA: Contar uma "história" pedagógica com início, meio e fim
3. PROFUNDIDADE: Conteúdo substancial e relevante, não tópicos genéricos
4. ENGAJAMENTO: Elementos interativos, perguntas e reflexões
5. CONTEXTUALIZAÇÃO: Situações reais que os alunos vivenciam

===  TIPOS DE SLIDES ===
- TITULO (1): Abertura impactante
- CONTEUDO (3-4): Desenvolvimento conceitual
- PRATICA (1-2): Atividade prática ou mão na massa
- QUESTAO (1-2): Reflexão ou desafio
- CONCLUSAO (1): Síntese e próximos passos

=== ESTRUTURA ===
- titulo: Frase impactante (máx 8 palavras)
- subtitulo: Frase de apoio (opcional)
- conteudo: 3-5 tópicos ou parágrafos
- icon: Nome de um ícone da Lucide (ex: Rocket, Lightbulb, Users)
- Linguagem acessível mas não simplista

IMPORTANTE:
- NÃO USE ASTERISCOS (**) para negrito ou destaque.
- Use letras MAIÚSCULAS para títulos ou termos importantes.
- Foque no CONTEÚDO de "${tema}", não em teoria pedagógica
- Slides devem engajar, não apenas informar
- RETORNE APENAS JSON (ARRAY), sem texto adicional:

Formato de resposta:
[
  {
    "numero": 1,
    "titulo": "Título",
    "subtitulo": "Subtítulo opcional",
    "conteudo": "Conteúdo...",
    "tipo": "titulo|conteudo|pratica|questao|conclusao",
    "icon": "nome-do-icone"
  }
]
`;

  try {
    const respostaBruta = await gerarTextoComIA(prompt);
    console.log('[geracao.service] slides response length:', respostaBruta?.length || 0);

    const jsonMatch = respostaBruta.match(/\\[[\\s\\S]*\\]/);
    if (!jsonMatch) throw new Error('Nenhum array JSON encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
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
