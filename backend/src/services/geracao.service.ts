// src/services/geracao.service.ts
import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

// Nota: extraímos o texto da BNCC (arquivo TXT) com getBnccText() para usar RAG nas prompts
async function getBnccSnippet() {
  return await getBnccText();
}

export async function gerarConteudo(disciplina: string, tema: string) {
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
3. PROFUNDO: Conteúdo substancial, não genérico
4. PROGRESSIVO: Considerando diferentes níveis de aprendizagem
5. CONTEXTUALIZADO: Situações reais que os alunos vivenciam

=== ESTRUTURA DO JSON ===
{
  "objetivo": "OBJETIVOS DE APRENDIZAGEM (3-4 parágrafos):
    - Objetivo geral claro e mensurável
    - 3-4 objetivos específicos (o que os alunos vão SABER FAZER ao final)
    - Competências desenvolvidas (pensamento crítico, criatividade, colaboração, etc.)
    - Conexões com outras disciplinas ou temas",
    
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

=== EXEMPLO DE QUALIDADE ===
Para "Segurança Digital":
{
  "objetivo": "OBJETIVO GERAL: Capacitar os alunos a proteger sua privacidade online e identificar ameaças digitais comuns.

OBJETIVOS ESPECÍFICOS:
• Reconhecer diferentes tipos de golpes digitais (phishing, perfis falsos, links maliciosos)
• Criar senhas seguras e entender a importância da autenticação
• Desenvolver senso crítico para não cair em armadilhas online
• Produzir um guia de segurança para compartilhar com a família

COMPETÊNCIAS: Pensamento crítico, resolução de problemas, responsabilidade digital e comunicação

CONEXÕES: Língua Portuguesa (interpretação de mensagens suspeitas), Matemática (probabilidade de ataques), Sociologia (impactos na sociedade)",

  "metodologia": "MOMENTO 1 - ENGAJAMENTO (10 min):
Perguntar: 'Quem aqui já clicou em um link e depois pensou: será que era seguro?' Enquete rápida no celular sobre experiências com segurança digital. Compartilhar manchetes recentes de vazamentos de dados que afetaram milhões de pessoas.

MOMENTO 2 - DESAFIO (15 min):
Mostrar 3 emails/mensagens reais (1 legítimo, 2 golpes). Desafiar a turma: 'Qual você confiaria?' Dividir em grupos para analisar. Discussão: por que alguns golpes são tão convincentes?

MOMENTO 3 - DESENVOLVIMENTO (20 min):
Demonstração prática ao vivo: como verificar se um link é seguro, onde olhar sinais de alerta em emails, como checar se suas senhas vazaram. Apresentar ferramentas gratuitas que eles podem usar (haveibeenpwned, verificadores de vírus).

MOMENTO 4 - PRÁTICA (25 min):
ATIVIDADE 'CAÇADORES DE GOLPES': Cada grupo recebe 5 cenários (emails, mensagens, posts) e precisa identificar os riscos, explicar por quê, e dizer o que fariam. Compartilhamento: grupos apresentam os casos mais interessantes.

MOMENTO 5 - CONSOLIDAÇÃO (15 min):
Construir juntos a 'Lista de Ouro da Segurança Digital' - 10 regras essenciais. Cada grupo contribui com uma regra baseada no que descobriu. Professor complementa com pontos-chave.

MOMENTO 6 - FECHAMENTO (5 min):
Missão para casa: fazer um 'check-up de segurança' na família usando a Lista de Ouro. Próxima aula: vamos aprender a criar um sistema de senhas pessoal super seguro.",

  "meta": "HABILIDADES PRINCIPAIS:
• Análise crítica de informações online
• Tomada de decisões seguras no ambiente digital
• Comunicação clara sobre riscos e proteções
• Capacidade de ensinar outros (ao compartilhar com família)

PREPARAÇÃO PARA A VIDA REAL:
Esta aula dá ferramentas concretas que os alunos usarão todos os dias: verificar links antes de clicar, criar senhas fortes, proteger dados pessoais. São habilidades de sobrevivência no mundo digital.

INDICADORES DE SUCESSO:
• Alunos conseguem identificar golpes com confiança
• Sabem explicar por que algo é suspeito
• Compartilham dicas de segurança com colegas e família",

  "atividade": "ATIVIDADE: CHECK-UP DE SEGURANÇA FAMILIAR

DESCRIÇÃO: Alunos fazem uma auditoria de segurança digital em casa, conversam com a família e criam um plano de melhorias.

MATERIAIS:
• Checklist de verificação (fornecido pelo professor)
• Smartphone ou computador
• Caderno para anotações

ORGANIZAÇÃO: Individual, com apoio familiar

PASSO A PASSO:
1. (5 min) Professor explica a missão e distribui checklist
2. (Em casa - 30 min) Aluno verifica: senhas fracas? 2FA ativado? Apps com permissões excessivas? Configurações de privacidade nas redes?
3. (Em casa - 20 min) Conversa com a família sobre descobertas, cria lista de 3 melhorias prioritárias
4. (Próxima aula - 15 min) Compartilhamento: quais descobertas mais surpreenderam? O que vão mudar?

ADAPTAÇÕES:
• Iniciante: Focar só em senhas e configurações básicas
• Intermediário: Adicionar análise de apps e permissões
• Avançado: Verificar vazamentos de dados e analisar histórico de navegação

AVALIAÇÃO:
• Completou o checklist? (3 pontos)
• Qualidade das recomendações? (4 pontos)
• Evidência de conversa familiar? (2 pontos)
• Reflexão sobre aprendizados? (1 ponto)

PRODUTO FINAL: Relatório do check-up + 3 ações concretas implementadas"
}

IMPORTANTE: 
- Foque no CONTEÚDO do tema "${tema}", não em explicar teoria pedagógica
- Seja prático e direto - professor quer usar isso amanhã na sala
- Mencione competências naturalmente, quando relevante (não force)
- APENAS JSON, sem texto adicional:
`;

  const respostaBruta = await gerarTextoComIA(prompt);

  try {
    // Remove qualquer texto antes/depois do JSON
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Nenhum JSON encontrado');

    let jsonStr = jsonMatch[0];
    // Remove blocos de código markdown
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '');
    jsonStr = jsonStr.trim();

    const conteudo = JSON.parse(jsonStr);
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      ...conteudo
    };
  } catch (error) {
    console.error('❌ Erro ao parsear JSON:', respostaBruta);
    // Fallback pedagógico melhorado
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      objetivo: `OBJETIVO GERAL: Desenvolver compreensão crítica e prática sobre ${tema}, promovendo competências digitais conforme a BNCC.

OBJETIVOS ESPECÍFICOS:
• Analisar conceitos fundamentais de ${tema} e sua relevância no contexto atual
• Aplicar conhecimentos em situações práticas do cotidiano
• Avaliar criticamente informações e fontes relacionadas ao tema
• Criar produtos que demonstrem domínio dos conceitos aprendidos

COMPETÊNCIAS BNCC: CG1 (Conhecimento), CG2 (Pensamento Científico), CG5 (Cultura Digital)`,
      metodologia: `MOMENTO 1 - ACOLHIMENTO (10 min): Roda de conversa inicial sobre experiências prévias com ${tema}.

MOMENTO 2 - PROBLEMATIZAÇÃO (15 min): Apresentação de situação-problema real que desperte curiosidade e engajamento.

MOMENTO 3 - DESENVOLVIMENTO (20 min): Exposição dialogada com recursos audiovisuais, demonstrações práticas e exemplos contextualizados.

MOMENTO 4 - PRÁTICA (25 min): Atividade colaborativa em grupos pequenos para aplicação dos conceitos.

MOMENTO 5 - SISTEMATIZAÇÃO (15 min): Construção coletiva de síntese do aprendizado com participação de todos.

MOMENTO 6 - ENCERRAMENTO (5 min): Conexão com próxima aula e orientações para atividades complementares.`,
      meta: `COMPETÊNCIAS GERAIS BNCC:
• CG5 (Cultura Digital): Compreender, utilizar e criar tecnologias digitais de forma crítica e ética
• CG2 (Pensamento Científico): Investigar, analisar e resolver problemas
• CG7 (Argumentação): Formular e defender ideias com base em evidências

INDICADORES DE SUCESSO:
• Participação ativa nas discussões
• Conclusão satisfatória das atividades práticas
• Demonstração de compreensão nos momentos de sistematização`,
      atividade: `ATIVIDADE PRÁTICA: Projeto em grupos sobre ${tema}

DESCRIÇÃO: Pesquisa guiada, análise crítica de fontes, produção de material educativo e apresentação.

MATERIAIS: Dispositivos digitais, materiais de papelaria, acesso à internet.

ORGANIZAÇÃO: Grupos de 4-5 alunos.

PRODUTO FINAL: Apresentação, infográfico ou vídeo educativo sobre o tema estudado.`
    };
  }
}

export async function gerarDisciplina(anoSerie: string, tema: string) {
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

  try {
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Nenhum JSON encontrado');

    let jsonStr = jsonMatch[0];
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(jsonStr);
    return parsed;
  } catch (err) {
    console.error('Erro ao parsear JSON de disciplina:', respostaBruta);
    return {
      nome: `Disciplina de ${tema}`,
      descricao: `Disciplina gerada sobre ${tema} para ${anoSerie}`,
      sugestoesUnidades: []
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  console.log(`[geracao.service] gerarAtividade called: tema=${tema} tipo=${tipo} anoSerie=${anoSerie} quantidade=${quantidade}`);

  const instrucoesDetalhadas: Record<string, string> = {
    objetiva: `ATIVIDADE DE MÚLTIPLA ESCOLHA (5-7 questões):
- Cada questão deve ter contexto/situação-problema antes das alternativas
- 4 alternativas (A, B, C, D) sendo apenas 1 correta
- Distratores (alternativas incorretas) devem ser plausíveis e comuns erros conceituais
- Inclua questões de diferentes níveis: conhecimento, compreensão, aplicação e análise
- Contextualize com situações reais do cotidiano dos alunos`,

    discursiva: `ATIVIDADE DISCURSIVA REFLEXIVA (4-5 questões):
- Questões que exijam argumentação, análise crítica e produção textual
- Inclua situações-problema reais para análise
- Peça posicionamento fundamentado do aluno
- Solicite conexões com a realidade e experiências pessoais
- Questões progressivas: da compreensão à síntese e avaliação`,

    pratica: `PROJETO PRÁTICO EM GRUPO:
- Descrição completa do projeto com todas as etapas
- Divisão de papéis sugerida para os membros do grupo
- Cronograma de execução (pelo menos 3 etapas)
- Lista de materiais e recursos necessários
- Produto final esperado com especificações claras
- Rubrica de avaliação com critérios detalhados`
  };

  const bncc = await getBnccSnippet();
  console.log('[geracao.service] BNCC snippet length:', bncc?.length || 0);

  const prompt = `
${bncc}

=== CONTEXTO ===
Você é um PROFESSOR AVALIADOR com experiência em criar instrumentos que realmente medem o aprendizado dos alunos.

=== MISSÃO ===
Crie ${quantidade} ATIVIDADE(S) AVALIATIVA(S) do tipo ${tipo.toUpperCase()} sobre "${tema}".
Ano/Série: ${anoSerie || 'Ensino Fundamental/Médio'}

=== REQUISITOS ===
${instrucoesDetalhadas[tipo] || instrucoesDetalhadas['discursiva']}

=== ESTRUTURA ===
Para CADA atividade, o enunciado DEVE conter:
1. CONTEXTUALIZAÇÃO: Situação real que introduz o problema
2. INSTRUÇÕES CLARAS: O que o aluno deve fazer
3. QUESTÕES/TAREFAS: Detalhamento do que será avaliado
4. ORIENTAÇÕES: Tempo, recursos, formato de resposta

Os CRITÉRIOS DE AVALIAÇÃO devem incluir:
1. DIMENSÕES: O que está sendo avaliado
2. NÍVEIS: Excelente, Satisfatório, Em desenvolvimento, Insuficiente
3. PONTOS: Peso de cada critério
4. INDICADORES: O que caracteriza cada nível

=== EXEMPLO DE QUALIDADE ===
{
  "enunciado": "ATIVIDADE: ANÁLISE CRÍTICA DE FAKE NEWS\\n\\nCONTEXTO:\\nEm 2022, uma imagem de urnas sendo transportadas em carro particular viralizou com a legenda 'urnas sendo manipuladas'. Milhares compartilharam antes de descobrir: eram urnas de TREINAMENTO para capacitação.\\n\\nINSTRUÇÕES:\\nAnalise o caso e responda de forma fundamentada.\\n\\nQUESTÕES:\\n\\n1. ANÁLISE (2 pts): Identifique 3 elementos suspeitos sobre essa notícia. Justifique.\\n\\n2. INVESTIGAÇÃO (2 pts): Como você verificaria usando ferramentas online? Cite 2 ferramentas.\\n\\n3. IMPACTO (3 pts): Analise os impactos sociais da disseminação de fake news sobre eleições.\\n\\n4. AÇÃO PRÁTICA (3 pts): Crie um guia (5-7 tópicos) para sua família sobre como identificar fake news.\\n\\nTEMPO: 45 min\\nFORMATO: Respostas dissertativas, mínimo 8 linhas",
  
  "criteriosAvaliacao": "AVALIAÇÃO - TOTAL: 10 PONTOS\\n\\nANÁLISE CRÍTICA (4 pts)\\nEXCELENTE (4): Identifica com precisão, fundamenta claramente\\nSATISFATÓRIO (3): Identifica corretamente, fundamentação parcial\\nEM DESENVOLVIMENTO (2): Identificação superficial\\nINSUFICIENTE (0-1): Não identifica adequadamente\\n\\nINVESTIGAÇÃO (2 pts)\\nEXCELENTE (2): Processo sistemático, ferramentas corretas\\nSATISFATÓRIO (1.5): Processo razoável\\nEM DESENVOLVIMENTO (1): Processo vago\\nINSUFICIENTE (0-0.5): Sem conhecimento de verificação\\n\\nCONSCIÊNCIA SOCIAL (2 pts)\\nEXCELENTE (2): Análise profunda, múltiplas perspectivas\\nSATISFATÓRIO (1.5): Análise adequada\\nEM DESENVOLVIMENTO (1): Análise superficial\\nINSUFICIENTE (0-0.5): Não demonstra compreensão\\n\\nAPLICAÇÃO PRÁTICA (2 pts)\\nEXCELENTE (2): Guia claro, prático, aplicável\\nSATISFATÓRIO (1.5): Guia útil\\nEM DESENVOLVIMENTO (1): Guia genérico\\nINSUFICIENTE (0-0.5): Guia confuso"
}

IMPORTANTE:
- Foque no CONTEÚDO do tema "${tema}", não em teoria pedagógica
- Seja prático - professor vai usar isto para avaliar alunos reais
- Crie atividades desafiadoras mas viáveis
- APENAS JSON (ARRAY), sem texto adicional:
`;

  const respostaBruta = await gerarTextoComIA(prompt);
  console.log('[geracao.service] respostaBruta length:', respostaBruta?.length || 0);
  console.log('[geracao.service] respostaBruta preview:', (respostaBruta || '').slice(0, 250));

  try {
    // Extrai JSON array
    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      // fallback: tentar extrair um objeto único e transformá-lo em array
      const objMatch = respostaBruta.match(/\{[\s\S]*\}/);
      if (!objMatch) throw new Error('Nenhum JSON encontrado');
      let objStr = objMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedObj = JSON.parse(objStr);
      console.log('[geracao.service] parsed single object fallback');
      return [parsedObj];
    }

    let jsonStr = jsonMatch[0];
    jsonStr = jsonStr.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('JSON retornado não é um array');
    console.log('[geracao.service] parsed array length:', parsed.length);
    return parsed.slice(0, quantidade);
  } catch (error) {
    console.error('Erro ao parsear JSON de atividade (array):', respostaBruta, error);
    // Fallback com atividade detalhada
    const fallback = Array.from({ length: quantidade }, (_, i) => ({
      enunciado: `ATIVIDADE AVALIATIVA: ${tema.toUpperCase()}

📌 CONTEXTUALIZAÇÃO:
Considerando os conceitos estudados sobre ${tema} e sua importância no contexto da cultura digital contemporânea...

📝 INSTRUÇÕES:
Responda às questões abaixo de forma completa e fundamentada.

❓ QUESTÕES:

1. COMPREENSÃO (2 pontos):
Explique com suas palavras o que você entende sobre ${tema} e qual sua importância no mundo atual.

2. ANÁLISE (3 pontos):
Identifique e analise um exemplo real de como ${tema} impacta a vida das pessoas no cotidiano.

3. APLICAÇÃO (3 pontos):
Proponha uma ação prática que você e sua comunidade poderiam realizar relacionada a ${tema}.

4. REFLEXÃO (2 pontos):
Como os conhecimentos sobre ${tema} podem contribuir para uma sociedade mais consciente e ética?

⏰ TEMPO SUGERIDO: 40 minutos`,
      criteriosAvaliacao: `📊 CRITÉRIOS DE AVALIAÇÃO - TOTAL: 10 PONTOS

🎯 CONHECIMENTO CONCEITUAL (2 pontos):
• Demonstra compreensão dos conceitos fundamentais
• Usa vocabulário adequado ao tema

🔍 CAPACIDADE ANALÍTICA (3 pontos):
• Identifica exemplos relevantes
• Estabelece relações pertinentes
• Fundamenta análises com argumentos

💡 APLICAÇÃO PRÁTICA (3 pontos):
• Propõe soluções viáveis
• Considera o contexto social
• Demonstra criatividade

📢 REFLEXÃO CRÍTICA (2 pontos):
• Apresenta posicionamento fundamentado
• Conecta tema com questões éticas e sociais

📚 COMPETÊNCIAS BNCC: CG2, CG5, CG7`
    }));
    return fallback;
  }
}

export async function sugerirUnidades(disciplina: string, anoSerie?: string, quantidade = 3) {
  console.log(`[geracao.service] sugerirUnidades called: disciplina=${disciplina} anoSerie=${anoSerie} quantidade=${quantidade}`);
  const bncc = await getBnccSnippet();
  console.log('[geracao.service] BNCC snippet length:', bncc?.length || 0);

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

  try {
    const respostaBruta = await gerarTextoComIA(prompt);
    console.log('[geracao.service] respostaBruta length:', respostaBruta?.length || 0);
    console.log('[geracao.service] respostaBruta preview:', (respostaBruta || '').slice(0, 300));

    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Nenhum JSON array encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) throw new Error('JSON retornado não é um array');

    return parsed.slice(0, quantidade).map((p: any) => ({ tema: p.tema || p.title || p.nome || '', objetivo: p.objetivo || p.objetivo || p.descricao || '' }));
  } catch (error) {
    console.error('Erro ao gerar sugestões de unidades:', error);
    // Fallback simples
    return Array.from({ length: quantidade }, (_, i) => ({ tema: `${disciplina} - Unidade ${i + 1}`, objetivo: `Objetivo da unidade ${i + 1} sobre ${disciplina}` }));
  }
}