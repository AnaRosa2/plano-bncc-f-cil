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
Você é um PEDAGOGO ESPECIALISTA com 20 anos de experiência em educação básica brasileira, especializado em Cultura Digital e tecnologias educacionais. Você domina profundamente a BNCC e metodologias ativas de aprendizagem.

=== MISSÃO ===
Crie um PLANO DE AULA COMPLETO, PROFUNDO E PRÁTICO sobre "${tema}" para a disciplina "${disciplina}".

=== REQUISITOS OBRIGATÓRIOS ===
1. ALINHAMENTO BNCC: Cite explicitamente códigos de habilidades (ex: EF06LP01, EM13CHS502) quando aplicável
2. PROFUNDIDADE: Cada seção deve ter conteúdo substancial e detalhado
3. APLICABILIDADE: O plano deve ser imediatamente utilizável por qualquer professor
4. PROGRESSÃO: Considere diferentes níveis de aprendizagem dos alunos
5. AVALIAÇÃO FORMATIVA: Inclua momentos de verificação durante a aula

=== ESTRUTURA DO JSON ===
RETORNE APENAS UM OBJETO JSON com esta estrutura exata:
{
  "objetivo": "OBJETIVOS DE APRENDIZAGEM (mínimo 4 parágrafos):
    - Objetivo geral da aula
    - 3-4 objetivos específicos mensuráveis (verbos de Bloom: analisar, criar, avaliar, aplicar)
    - Competências BNCC desenvolvidas com códigos específicos
    - Conexões interdisciplinares possíveis",
    
  "metodologia": "METODOLOGIA DETALHADA (mínimo 6 parágrafos):
    - MOMENTO 1 (10 min): Acolhimento e sensibilização - como engajar os alunos
    - MOMENTO 2 (15 min): Problematização - situação-problema que desperte curiosidade
    - MOMENTO 3 (20 min): Desenvolvimento - exposição dialogada com recursos multimídia
    - MOMENTO 4 (25 min): Prática - atividade hands-on colaborativa
    - MOMENTO 5 (15 min): Sistematização - síntese coletiva do aprendizado
    - MOMENTO 6 (5 min): Encerramento - conexão com próxima aula e tarefas",
    
  "meta": "METAS PEDAGÓGICAS E COMPETÊNCIAS BNCC (mínimo 3 parágrafos):
    - Competências gerais da BNCC desenvolvidas (citar números e descrições)
    - Habilidades específicas trabalhadas com códigos
    - Indicadores de sucesso observáveis
    - Relação com os pilares da educação: aprender a conhecer, fazer, conviver, ser",
    
  "atividade": "ATIVIDADE PRÁTICA DETALHADA (mínimo 5 parágrafos):
    - Descrição completa passo a passo da atividade principal
    - Materiais necessários (digitais e físicos)
    - Organização da turma (individual, duplas, grupos)
    - Roteiro de execução com tempos
    - Variações para diferentes níveis de dificuldade
    - Critérios de avaliação da atividade
    - Produto final esperado dos alunos"
}

=== EXEMPLO DE QUALIDADE ===
Para "Segurança Digital" em "Cultura Digital - 8º ano":
{
  "objetivo": "OBJETIVO GERAL: Desenvolver consciência crítica sobre práticas seguras no ambiente digital, capacitando os estudantes a proteger sua privacidade e identificar ameaças online.

OBJETIVOS ESPECÍFICOS:
• Analisar diferentes tipos de ameaças digitais (phishing, malware, engenharia social) e seus mecanismos de funcionamento
• Avaliar a segurança de senhas pessoais e criar estratégias de proteção de dados
• Criar um guia prático de boas práticas de segurança digital para compartilhar com familiares
• Sintetizar conhecimentos sobre direitos digitais previstos na LGPD e Marco Civil da Internet

COMPETÊNCIAS BNCC:
• Competência 1: Valorizar conhecimentos sobre proteção digital para entender a realidade
• Competência 5: Compreender, utilizar e criar tecnologias digitais de forma crítica e ética
• Habilidades: EF89LP27 (argumentar sobre temas controversos), EF09LI19 (discutir questões éticas em ambientes virtuais)

CONEXÕES INTERDISCIPLINARES: Matemática (criptografia básica), Língua Portuguesa (interpretação de termos de uso), Sociologia (impactos sociais)",

  "metodologia": "MOMENTO 1 - ACOLHIMENTO (10 min):
Iniciar com uma enquete interativa usando Mentimeter ou formulário: 'Você já teve alguma conta hackeada ou conhece alguém?'. Compartilhar estatísticas reais de crimes cibernéticos no Brasil (dados da SaferNet). Estabelecer acordo de confidencialidade para relatos pessoais.

MOMENTO 2 - PROBLEMATIZAÇÃO (15 min):
Apresentar caso real (notícia recente) de vazamento de dados ou golpe digital. Dividir a turma em grupos de 4-5 alunos para discutir: 'Como isso poderia ter sido evitado?'. Cada grupo anota 3 hipóteses em post-its virtuais (Padlet ou Jamboard).

MOMENTO 3 - DESENVOLVIMENTO (20 min):
Exposição dialogada com apresentação visual sobre: tipos de ameaças (phishing, ransomware, fake perfis), anatomia de um ataque, pirâmide de segurança digital. Demonstração prática: como verificar se um link é seguro, como identificar email falso, como checar vazamento de senhas (haveibeenpwned).

MOMENTO 4 - PRÁTICA (25 min):
ATIVIDADE 'DETETIVE DIGITAL': Cada grupo recebe 5 cenários simulados (emails, mensagens, sites) e deve classificar como seguro/suspeito, justificando. Usam checklist de verificação criado coletivamente. Grupos apresentam descobertas com evidências.

MOMENTO 5 - SISTEMATIZAÇÃO (15 min):
Construção coletiva de um 'Decálogo da Segurança Digital' no quadro/lousa digital. Cada grupo contribui com uma regra baseada nos aprendizados. Professor complementa com aspectos legais (LGPD, direitos do consumidor digital).

MOMENTO 6 - ENCERRAMENTO (5 min):
Desafio para casa: auditar a segurança digital da família (senhas, configurações de privacidade) usando checklist fornecido. Conexão com próxima aula: 'Na próxima aula, vamos criar nosso próprio gerenciador de senhas!'",

  "meta": "COMPETÊNCIAS GERAIS BNCC DESENVOLVIDAS:
• CG1 (Conhecimento): Compreensão dos mecanismos técnicos e sociais de ameaças digitais
• CG2 (Pensamento Científico): Investigação e análise crítica de cenários de risco
• CG5 (Cultura Digital): Uso crítico e responsável de tecnologias para proteção pessoal
• CG7 (Argumentação): Formulação de argumentos sobre práticas seguras baseados em evidências

HABILIDADES ESPECÍFICAS:
• EF89LP27: Argumentar sobre questões de segurança digital com base em dados
• EF67LP11: Produzir textos instrucionais (guia de segurança)
• EF09LI19: Discutir questões éticas no uso de tecnologias

INDICADORES DE SUCESSO:
• Aluno identifica corretamente 80% das ameaças nos cenários apresentados
• Aluno cria senha forte seguindo critérios técnicos aprendidos
• Aluno explica para um colega pelo menos 3 estratégias de proteção",

  "atividade": "ATIVIDADE: AUDITORIA DE SEGURANÇA DIGITAL FAMILIAR

DESCRIÇÃO: Os alunos realizarão uma auditoria completa das práticas de segurança digital em suas casas, aplicando os conhecimentos aprendidos e criando um relatório com recomendações.

MATERIAIS:
• Checklist de auditoria (fornecido pelo professor - impresso ou digital)
• Acesso a smartphone/computador familiar
• Caderno para anotações
• Modelo de relatório

ORGANIZAÇÃO: Individual, com compartilhamento familiar

ROTEIRO DE EXECUÇÃO:
1. (5 min) Explicação da atividade e distribuição do checklist
2. (Em casa - 30 min) Verificação de: senhas fracas, autenticação de dois fatores, permissões de apps, configurações de privacidade em redes sociais, emails suspeitos na caixa de entrada
3. (Em casa - 20 min) Preenchimento do relatório com descobertas e recomendações
4. (Próxima aula - 15 min) Compartilhamento anônimo de descobertas mais interessantes

NÍVEIS DE DIFICULDADE:
• Básico: Verificar apenas senhas e configurações de privacidade
• Intermediário: Adicionar análise de permissões de aplicativos
• Avançado: Incluir verificação de vazamentos e análise de emails suspeitos

CRITÉRIOS DE AVALIAÇÃO:
• Completude do checklist (30%): Todos os itens verificados
• Qualidade das recomendações (40%): Relevância e viabilidade
• Engajamento familiar (20%): Evidência de conversa com familiares
• Reflexão pessoal (10%): Insights sobre próprias práticas

PRODUTO FINAL: Relatório de auditoria + 3 ações concretas de melhoria implementadas"
}

IMPORTANTE: 
- Seu conteúdo deve ter esta mesma profundidade e detalhamento
- Adapte ao tema "${tema}" e disciplina "${disciplina}" solicitados
- NÃO seja superficial - professores precisam de orientações completas
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
Você é um AVALIADOR PEDAGÓGICO ESPECIALISTA com experiência em elaboração de instrumentos avaliativos alinhados à BNCC. Você cria atividades que realmente medem aprendizagem significativa.

=== MISSÃO ===
Crie ${quantidade} ATIVIDADE(S) AVALIATIVA(S) do tipo ${tipo.toUpperCase()} sobre "${tema}".
Ano/Série: ${anoSerie || 'Ensino Fundamental/Médio'}

=== REQUISITOS OBRIGATÓRIOS ===
${instrucoesDetalhadas[tipo] || instrucoesDetalhadas['discursiva']}

=== ESTRUTURA OBRIGATÓRIA ===
Para CADA atividade, o enunciado DEVE conter:
1. CONTEXTUALIZAÇÃO: Situação real ou simulada que introduz o problema
2. INSTRUÇÕES CLARAS: O que o aluno deve fazer exatamente
3. QUESTÕES/TAREFAS: Detalhamento completo do que será avaliado
4. ORIENTAÇÕES: Tempo sugerido, recursos permitidos, formato de resposta

Os CRITÉRIOS DE AVALIAÇÃO devem incluir:
1. DIMENSÕES AVALIADAS: Conhecimento, habilidades, atitudes
2. NÍVEIS DE DESEMPENHO: Excelente, Satisfatório, Em desenvolvimento, Insuficiente
3. DISTRIBUIÇÃO DE PONTOS: Peso de cada critério
4. INDICADORES OBSERVÁVEIS: O que caracteriza cada nível
5. ALINHAMENTO BNCC: Competências e habilidades avaliadas

=== EXEMPLO DE QUALIDADE PARA TIPO DISCURSIVA ===
{
  "enunciado": "ATIVIDADE AVALIATIVA: ANÁLISE CRÍTICA DE FAKE NEWS\\n\\n📌 CONTEXTUALIZAÇÃO:\\nDurante as eleições de 2022, uma imagem circulou nas redes sociais mostrando supostas urnas eletrônicas sendo transportadas em um carro particular. A legenda afirmava que as urnas estavam sendo 'manipuladas'. A imagem foi compartilhada milhares de vezes antes de agências de checagem desmentirem: tratava-se de urnas de TREINAMENTO sendo levadas para capacitação de mesários.\\n\\n📝 INSTRUÇÕES:\\nLeia o caso acima e responda às questões de forma dissertativa, fundamentando suas respostas com argumentos e exemplos.\\n\\n❓ QUESTÕES:\\n\\n1. ANÁLISE (2 pontos):\\nIdentifique pelo menos 3 elementos que poderiam levantar suspeitas sobre a veracidade dessa notícia ANTES de uma verificação formal. Justifique cada elemento.\\n\\n2. INVESTIGAÇÃO (2 pontos):\\nDescreva um passo a passo de como você verificaria a veracidade dessa informação usando ferramentas disponíveis na internet. Cite pelo menos 2 ferramentas específicas.\\n\\n3. IMPACTO SOCIAL (3 pontos):\\nAnalise os possíveis impactos sociais da disseminação de fake news sobre processos eleitorais. Considere aspectos como: confiança nas instituições, polarização política e participação democrática.\\n\\n4. AÇÃO CIDADÃ (3 pontos):\\nElabore um breve guia (5-7 tópicos) que você compartilharia com sua família sobre como identificar e não disseminar fake news. Seja prático e use linguagem acessível.\\n\\n⏰ TEMPO: 45 minutos\\n📋 FORMATO: Respostas dissertativas, mínimo 8 linhas por questão",
  
  "criteriosAvaliacao": "📊 CRITÉRIOS DE AVALIAÇÃO - TOTAL: 10 PONTOS\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n🎯 DIMENSÃO 1: ANÁLISE CRÍTICA (4 pontos)\\n\\nEXCELENTE (4): Identifica elementos suspeitos com precisão, fundamenta com clareza, demonstra pensamento crítico apurado\\nSATISFATÓRIO (3): Identifica elementos corretamente, fundamentação parcial\\nEM DESENVOLVIMENTO (2): Identificação superficial, pouca fundamentação\\nINSUFICIENTE (0-1): Não identifica elementos ou fundamentação inadequada\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n🔍 DIMENSÃO 2: INVESTIGAÇÃO E MÉTODO (2 pontos)\\n\\nEXCELENTE (2): Descreve processo sistemático, cita ferramentas corretas com uso adequado\\nSATISFATÓRIO (1.5): Processo razoável, ferramentas citadas\\nEM DESENVOLVIMENTO (1): Processo vago, ferramentas genéricas\\nINSUFICIENTE (0-0.5): Não demonstra conhecimento de verificação\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n📢 DIMENSÃO 3: CONSCIÊNCIA SOCIAL (2 pontos)\\n\\nEXCELENTE (2): Análise profunda dos impactos, múltiplas perspectivas, reflexão madura\\nSATISFATÓRIO (1.5): Análise adequada, algumas perspectivas\\nEM DESENVOLVIMENTO (1): Análise superficial, visão limitada\\nINSUFICIENTE (0-0.5): Não demonstra compreensão dos impactos\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n✅ DIMENSÃO 4: APLICAÇÃO PRÁTICA (2 pontos)\\n\\nEXCELENTE (2): Guia claro, prático, linguagem adequada, dicas relevantes e aplicáveis\\nSATISFATÓRIO (1.5): Guia útil, maioria das dicas aplicáveis\\nEM DESENVOLVIMENTO (1): Guia genérico, poucas dicas práticas\\nINSUFICIENTE (0-0.5): Guia confuso ou inaplicável\\n\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\\n📚 COMPETÊNCIAS BNCC AVALIADAS:\\n• CG2: Pensamento científico, crítico e criativo\\n• CG5: Cultura digital\\n• CG7: Argumentação\\n• EF89LP27: Argumentar sobre temas controversos\\n• EF89LP02: Analisar diferentes práticas de curadoria"
}

IMPORTANTE:
- Crie conteúdo com ESTE nível de detalhamento e profundidade
- Adapte ao tema "${tema}" e ao tipo "${tipo}" solicitado
- NÃO seja superficial - professores precisam de instrumentos completos
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