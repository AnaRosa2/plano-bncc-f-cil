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

=== CONTEXTO ===
Você é um DESIGNER INSTRUCIONAL SÊNIOR com especialização em criação de apresentações educacionais para ensino básico brasileiro. Você domina técnicas de design pedagógico, storytelling educacional e engajamento de alunos.

=== MISSÃO ===
Crie uma APRESENTAÇÃO DE SLIDES COMPLETA E PROFISSIONAL sobre "${tema}" para "${disciplina}"${anoSerie ? ` (${anoSerie})` : ''}.

=== REQUISITOS OBRIGATÓRIOS ===
1. QUANTIDADE: 8-10 slides (apresentação completa de 40-50 min de aula)
2. ESTRUTURA NARRATIVA: Os slides devem contar uma "história" pedagógica com início, meio e fim
3. PROFUNDIDADE: Cada slide deve ter conteúdo substancial, não apenas tópicos genéricos
4. ENGAJAMENTO: Incluir elementos interativos, perguntas e momentos de reflexão
5. ALINHAMENTO BNCC: Mencionar competências e habilidades quando relevante

=== TIPOS DE SLIDES OBRIGATÓRIOS ===
- TITULO (1): Abertura impactante com gancho de interesse
- CONTEUDO (5-6): Desenvolvimento conceitual progressivo e aprofundado
- QUESTAO (2): Momentos de reflexão e interação com a turma
- CONCLUSAO (1): Síntese, call-to-action e conexão com próximas aulas

=== ESTRUTURA DE CADA SLIDE ===
- titulo: Frase impactante, não genérica (máx 8 palavras)
- conteudo: 4-6 bullet points substantivos OU 2-3 parágrafos reflexivos
- Usar linguagem acessível mas não simplista

=== EXEMPLO DE QUALIDADE PARA "Cyberbullying" ===
[
  {
    "numero": 1,
    "titulo": "Cyberbullying: A Violência que Não Deixa Marcas Visíveis",
    "conteudo": "- 37% dos jovens brasileiros já sofreram algum tipo de agressão online\\n- Diferente do bullying tradicional, persegue a vítima 24h por dia\\n- Consequências podem ser devastadoras: ansiedade, depressão, isolamento\\n- Hoje vamos entender, identificar e aprender a combater",
    "tipo": "titulo"
  },
  {
    "numero": 2,
    "titulo": "O Que Caracteriza o Cyberbullying?",
    "conteudo": "- REPETIÇÃO: Ataques sistemáticos, não incidentes isolados\\n- INTENÇÃO: Propósito deliberado de humilhar, excluir ou intimidar\\n- DESEQUILÍBRIO DE PODER: Anonimato, número de agressores, viralização\\n- AMBIENTE DIGITAL: Redes sociais, jogos, grupos de mensagens, fóruns\\n- PERMANÊNCIA: Conteúdo pode ficar online indefinidamente\\n\\n📚 BNCC: Competência 9 - Empatia, diálogo e resolução de conflitos",
    "tipo": "conteudo"
  },
  {
    "numero": 3,
    "titulo": "Formas de Cyberbullying que Você Precisa Conhecer",
    "conteudo": "- FLAMING: Provocações e insultos em espaços públicos online\\n- HARASSMENT: Mensagens ofensivas repetidas e direcionadas\\n- DENIGRATION: Espalhar fofocas e mentiras para destruir reputação\\n- IMPERSONATION: Criar perfis falsos em nome de outra pessoa\\n- OUTING: Expor informações íntimas ou constrangedoras\\n- EXCLUSION: Remover propositalmente alguém de grupos\\n- CYBERSTALKING: Perseguição online sistemática",
    "tipo": "conteudo"
  },
  {
    "numero": 4,
    "titulo": "🤔 Momento de Reflexão",
    "conteudo": "Pense por 1 minuto antes de responder:\\n\\n1. Você já presenciou alguma situação de cyberbullying?\\n\\n2. Como você reagiu (ou reagiria)?\\n\\n3. Por que tantas pessoas veem e não fazem nada?\\n\\n💬 Vamos compartilhar sem expor nomes ou situações identificáveis",
    "tipo": "questao"
  },
  {
    "numero": 5,
    "titulo": "A Ciência Por Trás: Por Que as Pessoas Agridem Online?",
    "conteudo": "- EFEITO DESINIBIÇÃO: Anonimato reduz freios morais\\n- DESSENSIBILIZAÇÃO: Não ver o sofrimento afasta a empatia\\n- PRESSÃO SOCIAL: Busca de status e aceitação no grupo\\n- TRANSFERÊNCIA: Vítimas podem se tornar agressores\\n- IMPUNIDADE PERCEBIDA: Crença de que não haverá consequências\\n\\n🧠 Compreender não é justificar - é poder prevenir",
    "tipo": "conteudo"
  },
  {
    "numero": 6,
    "titulo": "Impactos Reais em Quem Sofre",
    "conteudo": "SAÚDE MENTAL:\\n- Ansiedade, depressão, baixa autoestima\\n- Ideação suicida em casos graves (Amanda Todd, 2012)\\n\\nVIDA ESCOLAR:\\n- Queda no rendimento, evasão, isolamento\\n\\nVIDA SOCIAL:\\n- Dificuldade de confiar, medo de interações\\n\\n⚠️ 70% das vítimas não contam para adultos por vergonha ou medo de perder acesso à internet",
    "tipo": "conteudo"
  },
  {
    "numero": 7,
    "titulo": "Como Agir: Vítima, Testemunha e Comunidade",
    "conteudo": "SE VOCÊ É VÍTIMA:\\n- Não responda ao agressor (é o que ele quer)\\n- Salve evidências (prints, links)\\n- Bloqueie e denuncie na plataforma\\n- Converse com adulto de confiança\\n\\nSE VOCÊ TESTEMUNHA:\\n- Não curta, não compartilhe, não comente\\n- Ofereça apoio privado à vítima\\n- Denuncie à plataforma e escola\\n\\n📱 Canais: SaferNet (safernet.org.br) - Disque 100",
    "tipo": "conteudo"
  },
  {
    "numero": 8,
    "titulo": "❓ Discussão em Grupos",
    "conteudo": "Em grupos de 4 pessoas, discutam (10 min):\\n\\n1. Quais REGRAS DE CONVIVÊNCIA DIGITAL nossa turma deveria adotar?\\n\\n2. Como APOIAR um colega que está sofrendo cyberbullying sem expô-lo ainda mais?\\n\\n3. Qual o PAPEL DA ESCOLA no combate ao cyberbullying?\\n\\n📝 Cada grupo vai apresentar 1 proposta concreta",
    "tipo": "questao"
  },
  {
    "numero": 9,
    "titulo": "Aspectos Legais: Cyberbullying É Crime",
    "conteudo": "LEGISLAÇÃO BRASILEIRA:\\n- Lei 13.185/2015: Programa de Combate ao Bullying\\n- Art. 146 CP: Constrangimento ilegal\\n- Art. 139/140 CP: Difamação e injúria\\n- ECA: Proteção integral a crianças e adolescentes\\n\\nCONSEQUÊNCIAS REAIS:\\n- Adolescentes respondem judicialmente a partir dos 12 anos\\n- Pais podem ser responsabilizados civilmente\\n- Escolas têm obrigação legal de intervir",
    "tipo": "conteudo"
  },
  {
    "numero": 10,
    "titulo": "Nossa Missão: Construir Comunidades Digitais Saudáveis",
    "conteudo": "O QUE APRENDEMOS HOJE:\\n- Cyberbullying é violência real com consequências sérias\\n- Todos temos papel: não ser agressor, não ser omisso\\n- Existem recursos de ajuda e leis de proteção\\n\\nSUA MISSÃO ESTA SEMANA:\\n- Revise suas interações online: são respeitosas?\\n- Identifique 1 ação positiva que você pode fazer\\n- Compartilhe o conhecimento com alguém\\n\\n🌟 Cidadãos digitais constroem um mundo online melhor",
    "tipo": "conclusao"
  }
]

IMPORTANTE:
- Crie conteúdo com ESTE nível de profundidade e detalhamento
- Adapte ao tema "${tema}" e disciplina "${disciplina}" solicitados
- NÃO seja superficial - slides genéricos não engajam alunos
- Inclua dados, exemplos reais, referências BNCC quando apropriado
- APENAS JSON (ARRAY), sem texto adicional:
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
