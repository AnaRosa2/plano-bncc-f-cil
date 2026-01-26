// src/services/geracao.service.ts
import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

// Nota: extraímos o texto da BNCC (arquivo TXT) com getBnccText() para usar RAG nas prompts
async function getBnccSnippet() {
  return await getBnccText();
}

export async function gerarConteudo(disciplina: string, tema: string) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
${bncc}

=== CONTEXTO ===
Você é um PROFESSOR EXPERIENTE com 20 anos de sala de aula. Você cria planos de aula que realmente funcionam na prática, são engajadores e desenvolvem competências essenciais nos alunos.

=== MISSÃO ===
Crie um PLANO DE AULA COMPLETO E PRÁTICO sobre "${tema}" para a disciplina "${disciplina}".

=== REQUISITOS ===
1. FOCO NO TEMA: O plano deve ser sobre "${tema}", não sobre teoria pedagógica
2. PRÁTICO: Deve ser imediatamente utilizável por qualquer professor
3. NÃO USE ASTERISCOS (**) para negrito ou negritos internos. Use apenas letras maiúsculas para destacar rótulos ou títulos.
4. PROFUNDO: Conteúdo substancial, não genérico
5. PROGRESSIVO: Considerando diferentes níveis de aprendizagem
6. CONTEXTUALIZADO: Situações reais que os alunos vivenciam

=== ESTRUTURA DO JSON ===
{
  "objetivo": "OBJETIVOS DE APRENDIZAGEM (3-4 parágrafos):
    - Objetivo geral claro e mensurável
    - 3-4 objetivos específicos (o que os alunos vão SABER FAZER ao final)
    - Competências desenvolvidas (pensamento crítico, criatividade, colaboração, etc.)
    - Conexões com outras disciplinas ou temas)",

  "metodologia": "METODOLOGIA DETALHADA (6 momentos):
    - MOMENTO 1 (10 min): Como iniciar e engajar os alunos
    - MOMENTO 2 (15 min): Situação-problema ou desafio instigante
    - MOMENTO 3 (20 min): Desenvolvimento do conteúdo com exemplos práticos
    - MOMENTO 4 (25 min): Atividade prática colaborativa
    - MOMENTO 5 (15 min): Síntese e consolidação do aprendizado
    - MOMENTO 6 (5 min): Fechamento e conexão com próxima aula",

  "meta": "METAS E COMPETÊNCIAS (2-3 parágrafos):
    - Principais habilidades desenvolvidas na aula
    - Como isso prepara os alunos para a vida real
    - Indicadores de que a aula foi bem-sucedida",

  "atividade": "ATIVIDADE PRÁTICA PRINCIPAL (detalhamento completo):
    - Descrição passo a passo da atividade
    - Materiais necessários (digitais e físicos)
    - Como organizar a turma (individual, duplas, grupos)
    - Roteiro de execução com tempos
    - Adaptações para diferentes níveis
    - Como avaliar o aprendizado
    - Produto final que os alunos criam"
}

IMPORTANTE: APENAS JSON, sem texto adicional:
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Nenhum JSON encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    const conteudo = JSON.parse(jsonStr);
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      ...conteudo
    };
  } catch (error) {
    console.error('❌ Erro na geração de conteúdo:', error);
    // Fallback pedagógico de alta qualidade (Rede de segurança)
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      objetivo: `OBJETIVO GERAL: Desenvolver compreensão crítica e prática sobre ${tema}, promovendo competências digitais conforme a BNCC.\n\nOBJETIVOS ESPECÍFICOS:\n• Analisar conceitos fundamentais de ${tema} e sua relevância\n• Aplicar conhecimentos em situações práticas\n• Avaliar criticamente informações relacionadas ao tema\n• Criar produtos que demonstrem domínio dos conceitos aprendidos\n\nCOMPETÊNCIAS BNCC: CG1, CG2, CG5`,
      metodologia: `MOMENTO 1 - ACOLHIMENTO (10 min): Roda de conversa inicial sobre experiências prévias.\n\nMOMENTO 2 - PROBLEMATIZAÇÃO (15 min): Apresentação de situação-problema real.\n\nMOMENTO 3 - DESENVOLVIMENTO (20 min): Exposição dialogada com exemplos práticos e contextualizados.\n\nMOMENTO 4 - PRÁTICA (25 min): Atividade colaborativa em grupos pequenos para aplicação dos conceitos.\n\nMOMENTO 5 - SISTEMATIZAÇÃO (15 min): Construção coletiva de síntese do aprendizado com participação de todos.\n\nMOMENTO 6 - ENCERRAMENTO (5 min): Conexão com próxima aula e orientações finais.`,
      meta: `COMPETÊNCIAS GERAIS BNCC:\n• CG5 (Cultura Digital): Compreender, utilizar e criar tecnologias digitais de forma crítica e ética\n• CG2 (Pensamento Científico): Investigar, analisar e resolver problemas\n• CG7 (Argumentação): Formular e defender ideias com base em evidências\n\nINDICADORES DE SUCESSO:\n• Participação ativa nas discussões\n• Conclusão satisfatória das atividades práticas\n• Demonstração de compreensão nos momentos de sistematização`,
      atividade: `ATIVIDADE PRÁTICA: Projeto em pequenos grupos sobre ${tema}\n\nDESCRIÇÃO: Pesquisa guiada, análise crítica de fontes, produção de material educativo e apresentação.\n\nMATERIAIS: Dispositivos digitais, materiais de papelaria, acesso à internet.\n\nPRODUTO FINAL: Apresentação, infográfico ou vídeo educativo sobre o tema estudado.`
    };
  }
}

export async function gerarDisciplina(anoSerie: string, tema: string) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
${bncc}

Você é um assistente pedagógico especializado em BNCC.

Crie uma disciplina de Cultura Digital para ${anoSerie}.
Foco em: ${tema}

RETORNE APENAS JSON VÁLIDO com a estrutura:
{
  "nome": "Nome da disciplina",
  "descricao": "Descrição completa",
  "sugestoesUnidades": [{ "tema": "..", "objetivo": ".." }]
}
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Nenhum JSON encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    console.error('Erro na geração de disciplina:', err);
    return {
      nome: `Disciplina de ${tema}`,
      descricao: `Disciplina gerada sobre ${tema} para ${anoSerie}`,
      sugestoesUnidades: [
        { tema: `Introdução ao ${tema}`, objetivo: `Compreender os fundamentos de ${tema}.` },
        { tema: `Práticas de ${tema}`, objetivo: `Aplicar conceitos de ${tema} em situações reais.` }
      ]
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  try {
    const instrucoesDetalhadas: Record<string, string> = {
      objetiva: `ATIVIDADE DE MÚLTIPLA ESCOLHA (5-7 questões):\n- Cada questão deve ter contexto/situação-problema antes das alternativas\n- 4 alternativas (A, B, C, D) sendo apenas 1 correta\n- Distratores plausíveis\n- Contextualize com situações reais do cotidiano`,

      discursiva: `ATIVIDADE DISCURSIVA REFLEXIVA (4-5 questões):\n- Questões que exijam argumentação, análise crítica e produção textual\n- Inclua situações-problema reais para análise\n- Peça posicionamento fundamentado do aluno\n- Questões progressivas: da compreensão à avaliação`,

      pratica: `PROJETO PRÁTICO EM GRUPO:\n- Descrição completa do projeto com todas as etapas (mínimo 3)\n- Divisão de papéis sugerida\n- Lista de materiais e recursos necessários\n- Produto final esperado com especificações claras\n- Rubrica de avaliação com critérios detalhados`
    };

    const bncc = await getBnccSnippet();
    const prompt = `
${bncc}

=== CONTEXTO ===
Você é um PROFESSOR AVALIADOR com experiência em criar instrumentos que realmente medem o aprendizado dos alunos.

=== MISSÃO ===
Crie ${quantidade} ATIVIDADE(S) AVALIATIVA(S) do tipo ${tipo.toUpperCase()} sobre "${tema}".
Ano/Série: ${anoSerie || 'Ensino Fundamental/Médio'}

=== REQUISITOS ESPECÍFICOS DO TIPO: ${tipo.toUpperCase()} ===
${instrucoesDetalhadas[tipo] || instrucoesDetalhadas['discursiva']}

=== REQUISITOS GERAIS ===
1. NÃO USE ASTERISCOS (**) para negrito. Use letras MAIÚSCULAS para títulos internos.
2. Seja prático - professor vai usar isto para avaliar alunos reais.
3. Alinhamento rigoroso à BNCC.

=== ESTRUTURA JSON (ARRAY [{}]) ===
{
  "enunciado": "CONTEXTUALIZAÇÃO + INSTRUÇÕES CLARAS + QUESTÕES/TAREFAS",
  "criteriosAvaliacao": "DIMENSÕES, NÍVEIS e PONTOS DE AVALIAÇÃO"
}

RETORNE APENAS UM ARRAY JSON:
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/) || respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON não encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    const array = Array.isArray(parsed) ? parsed : [parsed];
    return array.slice(0, quantidade);
  } catch (error) {
    console.error('❌ Erro na geração de atividade:', error);
    // Fallback inteligente baseado no tipo (Rede de segurança)
    if (tipo === 'objetiva') {
      return [{
        enunciado: `ATIVIDADE OBJETIVA: ${tema.toUpperCase()}\n\n1. Qual das alternativas melhor descreve o impacto de ${tema} na cultura digital contemporânea?\n\n(A) Opção 1\n(B) Opção 2\n(C) Opção 3\n(D) Opção 4`,
        criteriosAvaliacao: `1 ponto por questão correta. Total: 10 pontos.`
      }];
    } else if (tipo === 'pratica') {
      return [{
        enunciado: `PROJETO PRÁTICO: ${tema.toUpperCase()}\n\nOBJETIVO: Criar um produto digital que aplique os conceitos de ${tema}.\n\nETAPAS:\n1. Pesquisa inicial\n2. Planejamento do protótipo\n3. Execução e testes\n4. Apresentação final`,
        criteriosAvaliacao: `Criatividade: 4 pts\nAplicação técnica: 4 pts\nApresentação: 2 pts`
      }];
    }

    return [{
      enunciado: `ATIVIDADE DISCURSIVA: ${tema.toUpperCase()}\n\nCONTEXTO:\nAnalise o desafio de ${tema} para o desenvolvimento da cidadania digital.\n\nQUESTÕES:\n1. Como este tema impacta sua vida?\n2. Proponha uma solução ética para o problema apresentado.`,
      criteriosAvaliacao: `Domínio conceitual: 5 pts\nClareza argumentativa: 5 pts`
    }];
  }
}

export async function sugerirUnidades(disciplina: string, anoSerie?: string, quantidade = 3) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
${bncc}

Você é um assistente pedagógico. Para a disciplina "${disciplina}"${anoSerie ? `, ano/série: ${anoSerie}` : ''},
crie ${quantidade} SUGESTÕES DE UNIDADES DE ENSINO. Para cada unidade, retorne um objeto com as chaves:
{"tema":"...","objetivo":"..."}

RETORNE APENAS UM ARRAY JSON com a estrutura:
[
  {"tema":"...","objetivo":"..."}
]
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('JSON não encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.slice(0, quantidade).map((p: any) => ({
      tema: p.tema || p.title || p.nome || 'Unidade Sugerida',
      objetivo: p.objetivo || p.descricao || 'Desenvolver competências desta temática.'
    }));
  } catch (error) {
    console.error('Erro ao sugerir unidades:', error);
    return Array.from({ length: quantidade }, (_, i) => ({
      tema: `${disciplina} - Tema ${i + 1}`,
      objetivo: `Explorar os fundamentos de ${disciplina} aplicados à cultura digital.`
    }));
  }
}
