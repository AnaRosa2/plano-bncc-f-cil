import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ========================================
// CONTEXTO RAG - BNCC CULTURA DIGITAL
// Extraído do documento oficial da BNCC
// ========================================

const BNCC_CONTEXTO = `
CONTEXTO OFICIAL DA BASE NACIONAL COMUM CURRICULAR (BNCC) - CULTURA DIGITAL

A BNCC é um documento normativo que define o conjunto de aprendizagens essenciais que todos os alunos devem desenvolver ao longo das etapas da Educação Básica.

═══════════════════════════════════════════════════════════════════
COMPETÊNCIA GERAL 5 - CULTURA DIGITAL (FOCO PRINCIPAL)
═══════════════════════════════════════════════════════════════════

"Compreender, utilizar e criar tecnologias digitais de informação e comunicação de forma crítica, significativa, reflexiva e ética nas diversas práticas sociais (incluindo as escolares) para se comunicar, acessar e disseminar informações, produzir conhecimentos, resolver problemas e exercer protagonismo e autoria na vida pessoal e coletiva."

Esta competência estabelece que os estudantes devem:
• Compreender o funcionamento das tecnologias digitais
• Utilizar tecnologias de forma crítica e reflexiva
• Criar soluções tecnológicas com ética
• Exercer protagonismo digital
• Produzir conhecimentos usando ferramentas digitais

═══════════════════════════════════════════════════════════════════
OUTRAS COMPETÊNCIAS GERAIS RELACIONADAS
═══════════════════════════════════════════════════════════════════

CG1: Valorizar conhecimentos sobre o mundo físico, social, cultural e DIGITAL para entender a realidade.

CG2: Exercitar curiosidade intelectual para criar soluções (INCLUSIVE TECNOLÓGICAS).

CG4: Utilizar diferentes linguagens (incluindo DIGITAL) para se expressar e partilhar informações.

CG7: Argumentar com base em fatos, dados e informações confiáveis (combate à desinformação digital).

═══════════════════════════════════════════════════════════════════
EIXOS DA CULTURA DIGITAL
═══════════════════════════════════════════════════════════════════

1. PENSAMENTO COMPUTACIONAL
   - Decomposição de problemas
   - Reconhecimento de padrões
   - Abstração
   - Algoritmos e programação

2. MUNDO DIGITAL
   - Funcionamento das tecnologias
   - Análise crítica de mídias
   - Segurança e privacidade online
   - Pegada digital

3. TECNOLOGIA E SOCIEDADE
   - Uso ético e responsável
   - Cidadania digital
   - Direitos autorais
   - Inclusão digital

═══════════════════════════════════════════════════════════════════
HABILIDADES POR ETAPA DE ENSINO
═══════════════════════════════════════════════════════════════════

ANOS INICIAIS (1º ao 5º ano EF):
• EF01CO01: Utilizar ferramentas digitais de forma orientada
• EF02CO02: Reconhecer dispositivos tecnológicos e funções básicas
• EF03CO03: Organizar sequências lógicas para resolver problemas
• EF04CO04: Criar representações visuais com fluxogramas
• EF05CO05: Desenvolver programas básicos em ambientes visuais

ANOS FINAIS (6º ao 9º ano EF):
• EF06CO06: Analisar impacto das tecnologias na sociedade
• EF07CO07: Compreender e aplicar conceitos de algoritmos
• EF08CO08: Desenvolver projetos com programação textual
• EF09CO09: Analisar questões éticas de dados e privacidade
• EF09CO10: Criar soluções tecnológicas colaborativas

ENSINO MÉDIO:
• EM13CO11: Investigar algoritmos e estruturas de dados avançados
• EM13CO12: Desenvolver projetos interdisciplinares de programação
• EM13CO13: Avaliar impacto da IA e automação
• EM13CO14: Propor soluções para desafios socioambientais
• EM13CO15: Exercer cidadania digital ativa

═══════════════════════════════════════════════════════════════════
METODOLOGIAS ATIVAS RECOMENDADAS
═══════════════════════════════════════════════════════════════════

1. Aprendizagem Baseada em Projetos (ABP)
2. Programação Desplugada
3. Cultura Maker / Faça Você Mesmo
4. Gamificação
5. Aprendizagem Colaborativa
6. Sala de Aula Invertida

═══════════════════════════════════════════════════════════════════
IMPORTANTE: Use APENAS códigos de habilidades listados acima.
Não invente novos códigos. Se não tiver certeza, use CG5.
═══════════════════════════════════════════════════════════════════
`;

// Função para obter habilidades específicas por etapa
function getHabilidadesEtapa(anoSerie: string): string {
  const ano = anoSerie.toLowerCase();
  
  if (ano.includes('1º') || ano.includes('2º') || ano.includes('3º') || 
      ano.includes('4º') || ano.includes('5º') || ano.includes('iniciais')) {
    return `
HABILIDADES PARA ANOS INICIAIS (use estes códigos):
• EF01CO01: Utilizar ferramentas digitais de forma orientada
• EF02CO02: Reconhecer dispositivos tecnológicos e funções básicas
• EF03CO03: Organizar sequências lógicas para resolver problemas
• EF04CO04: Criar representações visuais com fluxogramas
• EF05CO05: Desenvolver programas básicos em ambientes visuais

Foco: atividades lúdicas, concretas, programação desplugada e ambientes visuais.
`;
  }
  
  if (ano.includes('6º') || ano.includes('7º') || ano.includes('8º') || 
      ano.includes('9º') || ano.includes('finais')) {
    return `
HABILIDADES PARA ANOS FINAIS (use estes códigos):
• EF06CO06: Analisar impacto das tecnologias na sociedade
• EF07CO07: Compreender e aplicar conceitos de algoritmos
• EF08CO08: Desenvolver projetos com programação textual
• EF09CO09: Analisar questões éticas de dados e privacidade
• EF09CO10: Criar soluções tecnológicas colaborativas

Foco: pensamento crítico, programação textual, projetos colaborativos, ética digital.
`;
  }
  
  if (ano.includes('em') || ano.includes('médio')) {
    return `
HABILIDADES PARA ENSINO MÉDIO (use estes códigos):
• EM13CO11: Investigar algoritmos e estruturas de dados avançados
• EM13CO12: Desenvolver projetos interdisciplinares de programação
• EM13CO13: Avaliar impacto da IA e automação
• EM13CO14: Propor soluções para desafios socioambientais
• EM13CO15: Exercer cidadania digital ativa

Foco: projetos avançados, interdisciplinaridade, IA, impacto social, protagonismo.
`;
  }
  
  return `Use habilidades gerais da Competência Geral 5 (CG5) da BNCC.`;
}

interface GerarConteudoRequest {
  tipo: "plano_aula" | "atividade_avaliativa" | "sugerir_unidades";
  tema?: string;
  disciplina?: string;
  anoSerie?: string;
  objetivo?: string;
  habilidadesBNCC?: string;
  tipoAtividade?: "objetiva" | "discursiva" | "pratica";
  usarIALocal?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: GerarConteudoRequest = await req.json();
    const { tipo, tema, disciplina, anoSerie, objetivo, habilidadesBNCC, tipoAtividade, usarIALocal } = body;

    console.log("Gerando conteúdo com RAG:", { tipo, tema, disciplina, anoSerie });

    // Verificar se deve usar IA local (Ollama/TinyLlama)
    if (usarIALocal) {
      console.log("Modo IA local solicitado - retornando resposta simplificada");
      return gerarRespostaLocal(tipo, tema, disciplina, anoSerie, tipoAtividade);
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.log("LOVABLE_API_KEY não encontrada - usando resposta local");
      return gerarRespostaLocal(tipo, tema, disciplina, anoSerie, tipoAtividade);
    }

    // Construir contexto RAG com habilidades específicas da etapa
    const habilidadesEtapa = getHabilidadesEtapa(anoSerie || "");
    const contextoCompleto = BNCC_CONTEXTO + "\n" + habilidadesEtapa;

    let systemPrompt = "";
    let userPrompt = "";

    if (tipo === "plano_aula") {
      systemPrompt = `Você é um especialista em pedagogia e educação brasileira.

${contextoCompleto}

REGRAS OBRIGATÓRIAS:
1. SEMPRE referencie a Competência Geral 5 (CG5) da BNCC
2. Use APENAS códigos de habilidades listados acima (nunca invente)
3. Inclua metodologias ativas recomendadas
4. Foque em Cultura Digital e pensamento computacional
5. Adapte a linguagem e complexidade para ${anoSerie || "a etapa indicada"}`;

      userPrompt = `Crie um plano de aula DETALHADO e PROFISSIONAL para:
- Disciplina: ${disciplina || "Cultura Digital"}
- Ano/Série: ${anoSerie || "Ensino Fundamental"}
- Tema: ${tema}
- Objetivo geral: ${objetivo || "Desenvolver competências digitais alinhadas à BNCC"}
${habilidadesBNCC ? `- Habilidades BNCC indicadas: ${habilidadesBNCC}` : ""}

O plano deve conter EXATAMENTE este formato JSON:
{
  "objetivos": "3-5 objetivos específicos de aprendizagem, separados por ponto e vírgula. Inclua referência à BNCC (ex: 'Desenvolver habilidade EF08CO08...')",
  "conteudos": "Descrição detalhada dos conteúdos a serem trabalhados, com conexão à Cultura Digital",
  "metodologia": "Metodologia de ensino usando METODOLOGIAS ATIVAS da BNCC: momentos da aula (início com problematização, desenvolvimento com atividade prática, fechamento com reflexão)",
  "recursosDidaticos": "Lista de recursos necessários, separados por ponto e vírgula (incluir recursos digitais e desplugados)",
  "avaliacao": "Critérios de avaliação alinhados às competências da BNCC, mencionando CG5",
  "tempoEstimado": "Duração estimada (ex: 2 aulas de 50 minutos)",
  "referenciasBNCC": "Competências e habilidades da BNCC utilizadas (ex: CG5, EF08CO08)"
}

IMPORTANTE: 
- Retorne APENAS o JSON válido
- Mencione explicitamente "Alinhado à CG5" ou códigos específicos
- Use metodologias ativas como ABP, gamificação, maker`;
    } else if (tipo === "atividade_avaliativa") {
      const tipoDescricao = {
        objetiva: "questões de múltipla escolha (4 alternativas cada, com gabarito)",
        discursiva: "questões dissertativas que exigem reflexão crítica sobre tecnologia e sociedade",
        pratica: "atividade prática/projeto hands-on com entregáveis claros",
      };

      systemPrompt = `Você é um especialista em avaliação educacional alinhada à BNCC.

${contextoCompleto}

REGRAS:
1. Atividades devem avaliar competências da CG5
2. Inclua reflexão crítica sobre uso de tecnologias
3. Questões devem ser contextualizadas na realidade do aluno
4. Para ${anoSerie || "a etapa"}, use linguagem adequada`;

      userPrompt = `Crie uma atividade avaliativa do tipo "${tipoAtividade}" para:
- Tema: ${tema}
- Tipo: ${tipoDescricao[tipoAtividade || "discursiva"]}

A atividade deve conter EXATAMENTE este formato JSON:
{
  "enunciado": "Texto completo do enunciado com instruções claras. Para objetivas: inclua 3-4 questões com alternativas A, B, C, D. Para discursivas: 2-3 questões reflexivas. Para práticas: descrição completa do projeto/atividade.",
  "criteriosAvaliacao": "Critérios detalhados de avaliação baseados nas competências da BNCC (CG5), separados por ponto e vírgula",
  "gabarito": "Para objetivas: respostas corretas. Para discursivas: pontos esperados na resposta. Para práticas: rubrica de avaliação",
  "competenciasBNCC": "CG5 e habilidades específicas avaliadas"
}

IMPORTANTE: Retorne APENAS o JSON válido.`;
    } else if (tipo === "sugerir_unidades") {
      systemPrompt = `Você é um especialista em currículo de Cultura Digital alinhado à BNCC.

${contextoCompleto}

Sugira temas que:
1. Desenvolvam a Competência Geral 5
2. Sejam adequados para ${anoSerie || "a etapa indicada"}
3. Incluam pensamento computacional
4. Abordem ética e cidadania digital`;

      userPrompt = `Sugira 5 temas de unidades de ensino para:
- Disciplina: ${disciplina}
- Ano/Série: ${anoSerie}

Cada tema deve ser sobre Cultura Digital e alinhado à BNCC.

Responda EXATAMENTE neste formato JSON:
{
  "sugestoes": [
    {"tema": "Nome do tema 1", "objetivo": "Objetivo geral desta unidade", "habilidadeBNCC": "Código da habilidade principal (ex: EF08CO08)"},
    {"tema": "Nome do tema 2", "objetivo": "Objetivo geral desta unidade", "habilidadeBNCC": "Código da habilidade principal"},
    {"tema": "Nome do tema 3", "objetivo": "Objetivo geral desta unidade", "habilidadeBNCC": "Código da habilidade principal"},
    {"tema": "Nome do tema 4", "objetivo": "Objetivo geral desta unidade", "habilidadeBNCC": "Código da habilidade principal"},
    {"tema": "Nome do tema 5", "objetivo": "Objetivo geral desta unidade", "habilidadeBNCC": "Código da habilidade principal"}
  ]
}

Use APENAS códigos de habilidades listados no contexto. Retorne APENAS o JSON.`;
    }

    console.log("Enviando para Lovable AI com contexto RAG...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      console.log(`Erro na API (${response.status}) - usando resposta local como fallback`);
      return gerarRespostaLocal(tipo, tema, disciplina, anoSerie, tipoAtividade);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.log("Resposta vazia da IA - usando fallback local");
      return gerarRespostaLocal(tipo, tema, disciplina, anoSerie, tipoAtividade);
    }

    console.log("Resposta recebida com sucesso");

    // Parse the JSON response
    let parsedContent;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Erro ao parsear resposta:", parseError);
      console.log("Usando fallback local devido a erro de parse");
      return gerarRespostaLocal(tipo, tema, disciplina, anoSerie, tipoAtividade);
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao gerar conteúdo:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Função para gerar respostas locais simplificadas (fallback)
function gerarRespostaLocal(
  tipo: string,
  tema?: string,
  disciplina?: string,
  anoSerie?: string,
  tipoAtividade?: string
): Response {
  console.log("Gerando resposta local simplificada (modo offline/fallback)");
  
  let resposta: any;
  const temaTexto = tema || "Tecnologia e Sociedade";
  
  if (tipo === "plano_aula") {
    resposta = {
      objetivos: `Compreender conceitos básicos de ${temaTexto}; Desenvolver habilidades de pensamento computacional (CG5); Aplicar conhecimentos de forma crítica e ética; Criar soluções colaborativas para problemas do cotidiano`,
      conteudos: `Fundamentos de ${temaTexto} na perspectiva da Cultura Digital. Conceitos de pensamento computacional: decomposição, padrões, abstração e algoritmos. Reflexão sobre uso ético e responsável da tecnologia.`,
      metodologia: `INÍCIO (10 min): Problematização com pergunta geradora sobre ${temaTexto}. DESENVOLVIMENTO (30 min): Atividade prática em grupos utilizando metodologia Maker - criação de protótipos ou soluções para um problema real. FECHAMENTO (10 min): Roda de conversa para reflexão sobre aprendizados e conexão com a BNCC CG5.`,
      recursosDidaticos: `Computadores ou tablets (se disponíveis); Materiais para atividades desplugadas; Quadro branco; Materiais recicláveis para protótipos; Fichas de atividades impressas`,
      avaliacao: `Avaliação processual durante as atividades práticas (participação e colaboração); Avaliação do produto final (criatividade e aplicação de conceitos); Auto-avaliação reflexiva sobre aprendizados. Critérios baseados na CG5 da BNCC.`,
      tempoEstimado: `2 aulas de 50 minutos`,
      referenciasBNCC: `Competência Geral 5 (CG5): Compreender, utilizar e criar tecnologias digitais de forma crítica, significativa e ética.`,
      _avisoIALocal: "⚠️ Conteúdo gerado localmente (resposta simplificada). Para conteúdo mais detalhado e personalizado, conecte-se à internet."
    };
  } else if (tipo === "atividade_avaliativa") {
    if (tipoAtividade === "objetiva") {
      resposta = {
        enunciado: `ATIVIDADE AVALIATIVA - ${temaTexto.toUpperCase()}\n\nLeia com atenção e responda:\n\n1. Qual é o principal objetivo da Competência Geral 5 (CG5) da BNCC em relação às tecnologias digitais?\n(A) Usar tecnologias apenas para entretenimento\n(B) Compreender, utilizar e criar tecnologias de forma crítica e ética\n(C) Evitar o uso de tecnologias na escola\n(D) Usar tecnologias sem reflexão sobre seus impactos\n\n2. O pensamento computacional envolve:\n(A) Apenas saber programar computadores\n(B) Decomposição, reconhecimento de padrões, abstração e algoritmos\n(C) Usar redes sociais corretamente\n(D) Memorizar comandos de programação\n\n3. Cidadania digital significa:\n(A) Ter muitos seguidores nas redes sociais\n(B) Usar a internet de forma ética, responsável e segura\n(C) Compartilhar qualquer informação online\n(D) Não usar tecnologias`,
        criteriosAvaliacao: `Compreensão dos conceitos da BNCC CG5 (3 pontos); Identificação correta de elementos do pensamento computacional (3 pontos); Entendimento sobre cidadania digital (4 pontos)`,
        gabarito: `1-B; 2-B; 3-B`,
        competenciasBNCC: `CG5 - Cultura Digital`,
        _avisoIALocal: "⚠️ Atividade gerada localmente."
      };
    } else if (tipoAtividade === "pratica") {
      resposta = {
        enunciado: `PROJETO PRÁTICO: ${temaTexto.toUpperCase()}\n\nObjetivo: Aplicar conhecimentos de Cultura Digital para resolver um problema real.\n\nDesafio: Em grupos de 3-4 alunos, vocês devem:\n\n1. IDENTIFICAR um problema do dia a dia que pode ser resolvido com tecnologia\n2. PLANEJAR uma solução usando pensamento computacional (decomposição, padrões, algoritmo)\n3. CRIAR um protótipo (pode ser desenho, maquete, ou usando materiais recicláveis)\n4. APRESENTAR para a turma explicando como a solução funciona\n\nTempo: 2 aulas para criação + 1 aula para apresentações\n\nMateriais permitidos: papel, cartolina, materiais recicláveis, tablets (se disponíveis)`,
        criteriosAvaliacao: `Identificação clara do problema (2 pontos); Uso correto do pensamento computacional (3 pontos); Criatividade e viabilidade da solução (2 pontos); Qualidade da apresentação (2 pontos); Trabalho em equipe (1 ponto)`,
        gabarito: `Rubrica de avaliação por critérios acima`,
        competenciasBNCC: `CG5 - Cultura Digital; CG2 - Pensamento científico e criativo`,
        _avisoIALocal: "⚠️ Atividade gerada localmente."
      };
    } else {
      resposta = {
        enunciado: `QUESTÕES REFLEXIVAS: ${temaTexto.toUpperCase()}\n\n1. Explique, com suas palavras, o que significa usar a tecnologia de forma "crítica e ética" conforme propõe a BNCC. Dê um exemplo do seu cotidiano.\n\n2. Como o pensamento computacional pode ajudar a resolver problemas que não envolvem computadores? Descreva uma situação.\n\n3. Quais são os principais cuidados que devemos ter ao compartilhar informações na internet? Por que isso é importante para a cidadania digital?`,
        criteriosAvaliacao: `Compreensão do conceito de uso crítico e ético (3 pontos); Capacidade de aplicar pensamento computacional (4 pontos); Reflexão sobre cidadania digital e segurança (3 pontos)`,
        gabarito: `Respostas devem demonstrar: 1) Entendimento de que uso crítico significa questionar e refletir sobre o impacto das tecnologias; 2) Aplicação de decomposição e lógica em problemas cotidianos; 3) Consciência sobre privacidade, veracidade de informações e respeito online`,
        competenciasBNCC: `CG5 - Cultura Digital; CG7 - Argumentação`,
        _avisoIALocal: "⚠️ Atividade gerada localmente."
      };
    }
  } else if (tipo === "sugerir_unidades") {
    resposta = {
      sugestoes: [
        { tema: "Introdução ao Pensamento Computacional", objetivo: "Desenvolver habilidades de decomposição, padrões e algoritmos através de atividades desplugadas", habilidadeBNCC: "CG5" },
        { tema: "Cidadania Digital e Uso Ético da Internet", objetivo: "Refletir sobre comportamento online, privacidade e combate ao cyberbullying", habilidadeBNCC: "CG5" },
        { tema: "Fake News e Alfabetização Midiática", objetivo: "Desenvolver senso crítico para identificar e combater desinformação", habilidadeBNCC: "CG5" },
        { tema: "Programação Criativa com Blocos", objetivo: "Criar projetos interativos usando ambientes visuais de programação", habilidadeBNCC: "CG5" },
        { tema: "Tecnologia e Sustentabilidade", objetivo: "Propor soluções tecnológicas para desafios ambientais locais", habilidadeBNCC: "CG5" }
      ],
      _avisoIALocal: "⚠️ Sugestões geradas localmente."
    };
  }

  return new Response(JSON.stringify(resposta), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
