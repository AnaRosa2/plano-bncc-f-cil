// src/services/geracao.service.slides.ts
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
${bncc}

Você é um designer instrucional especializado em criar apresentações pedagógicas.

CRIE 6-8 SLIDES EDUCACIONAIS sobre "${tema}" para "${disciplina}"${anoSerie ? ` (${anoSerie})` : ''}.

Diretrizes:
- Slides limpos e objetivos (adequados para projeção)
- Linguagem apropriada ao nível dos alunos
- Use bullet points e frases curtas
- Inclua perguntas reflexivas quando apropriado
- Alinhado à BNCC

RETORNE APENAS UM ARRAY JSON de slides:
[
  {
    "numero": 1,
    "titulo": "Título do Slide",
    "conteudo": "- Ponto 1\\n- Ponto 2\\n- Ponto 3",
    "tipo": "titulo|conteudo|questao|conclusao"
  }
]

Exemplo para "Fake News":
[
  {"numero": 1, "titulo": "Fake News: O Que São?", "conteudo": "- Notícias falsas criadas para enganar\\n- Esp alham-se rapidamente nas redes sociais\\n- Podem causar danos reais", "tipo": "titulo"},
  {"numero": 2, "titulo": "Por Que Existem?", "conteudo": "- Gerar cliques e lucro\\n- Manipular opiniões\\n- Causar confusão", "tipo": "conteudo"},
  {"numero": 3, "titulo": "Como Identificar?", "conteudo": "- Verifique a fonte\\n- Pesquise em outros veículos\\n- Desconfie de títulos sensacionalistas\\n- Use sites de fact-checking", "tipo": "conteudo"},
  {"numero": 4, "titulo": "Pense e Responda", "conteudo": "Você já compartilhou algo sem verificar a fonte?\\n\\nComo podemos ser mais críticos online?", "tipo": "questao"},
  {"numero": 5, "titulo": "Ferramentas Úteis", "conteudo": "- Agência Lupa\\n- Aos Fatos\\n- Comprova\\n- Google Reverso de Imagens", "tipo": "conteudo"},
  {"numero": 6, "titulo": "Nossa Responsabilidade", "conteudo": "- Verificar antes de compartilhar\\n- Denunciar conteúdo falso\\n- Educar amigos e família\\n- Praticar cidadania digital", "tipo": "conclusao"}
]

APENAS JSON, sem texto adicional:
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
