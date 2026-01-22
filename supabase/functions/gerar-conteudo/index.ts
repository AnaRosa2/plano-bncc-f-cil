import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GerarConteudoRequest {
  tipo: "plano_aula" | "atividade_avaliativa" | "sugerir_unidades";
  tema?: string;
  disciplina?: string;
  anoSerie?: string;
  objetivo?: string;
  habilidadesBNCC?: string;
  tipoAtividade?: "objetiva" | "discursiva" | "pratica";
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const body: GerarConteudoRequest = await req.json();
    const { tipo, tema, disciplina, anoSerie, objetivo, habilidadesBNCC, tipoAtividade } = body;

    console.log("Gerando conteúdo:", { tipo, tema, disciplina });

    let systemPrompt = "";
    let userPrompt = "";

    if (tipo === "plano_aula") {
      systemPrompt = `Você é um especialista em pedagogia e educação brasileira, com profundo conhecimento da Base Nacional Comum Curricular (BNCC). 
Seu papel é criar planos de aula detalhados, alinhados à BNCC, focados em Cultura Digital.
Sempre responda em português brasileiro, de forma clara e didática para professores.`;

      userPrompt = `Crie um plano de aula completo para:
- Disciplina: ${disciplina || "Cultura Digital"}
- Ano/Série: ${anoSerie || "Ensino Fundamental"}
- Tema: ${tema}
- Objetivo geral: ${objetivo || "Desenvolver competências digitais"}
- Habilidades BNCC: ${habilidadesBNCC || "Competências gerais da BNCC"}

O plano deve conter EXATAMENTE este formato JSON:
{
  "objetivos": "Lista de 3-5 objetivos específicos de aprendizagem, separados por ponto e vírgula",
  "conteudos": "Descrição detalhada dos conteúdos a serem trabalhados",
  "metodologia": "Descrição da metodologia de ensino, incluindo momentos da aula (início, desenvolvimento, fechamento)",
  "recursosDidaticos": "Lista de recursos necessários, separados por ponto e vírgula",
  "avaliacao": "Descrição dos critérios e formas de avaliação",
  "tempoEstimado": "Duração estimada (ex: 2 aulas de 50 minutos)"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.`;
    } else if (tipo === "atividade_avaliativa") {
      const tipoDescricao = {
        objetiva: "questões de múltipla escolha ou verdadeiro/falso",
        discursiva: "questões dissertativas que exigem reflexão e argumentação",
        pratica: "atividade prática ou projeto hands-on",
      };

      systemPrompt = `Você é um especialista em avaliação educacional, com foco em criar atividades avaliativas alinhadas à BNCC.
Seu objetivo é criar atividades que avaliem competências de Cultura Digital de forma significativa.
Sempre responda em português brasileiro.`;

      userPrompt = `Crie uma atividade avaliativa do tipo "${tipoAtividade}" para:
- Tema: ${tema}
- Tipo: ${tipoDescricao[tipoAtividade || "discursiva"]}

A atividade deve conter EXATAMENTE este formato JSON:
{
  "enunciado": "Texto completo do enunciado da atividade, incluindo instruções claras para o aluno",
  "criteriosAvaliacao": "Lista de critérios de avaliação detalhados, separados por ponto e vírgula"
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.`;
    } else if (tipo === "sugerir_unidades") {
      systemPrompt = `Você é um especialista em currículo escolar e BNCC, especializado em Cultura Digital.
Sugira temas de unidades de ensino relevantes e alinhados à BNCC.
Sempre responda em português brasileiro.`;

      userPrompt = `Sugira 5 temas de unidades de ensino (aulas) para:
- Disciplina: ${disciplina}
- Ano/Série: ${anoSerie}

Cada tema deve ser sobre Cultura Digital e estar alinhado à BNCC.

Responda EXATAMENTE neste formato JSON:
{
  "sugestoes": [
    {"tema": "Nome do tema 1", "objetivo": "Objetivo geral desta unidade"},
    {"tema": "Nome do tema 2", "objetivo": "Objetivo geral desta unidade"},
    {"tema": "Nome do tema 3", "objetivo": "Objetivo geral desta unidade"},
    {"tema": "Nome do tema 4", "objetivo": "Objetivo geral desta unidade"},
    {"tema": "Nome do tema 5", "objetivo": "Objetivo geral desta unidade"}
  ]
}

IMPORTANTE: Retorne APENAS o JSON, sem texto adicional.`;
    }

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
      const errorText = await response.text();
      console.error("Erro na API de IA:", response.status, errorText);
      throw new Error(`Erro na API de IA: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    console.log("Resposta da IA:", content);

    // Parse the JSON response
    let parsedContent;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      parsedContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Erro ao parsear resposta:", parseError);
      throw new Error("Resposta da IA em formato inválido");
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
