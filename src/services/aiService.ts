import { supabase } from "@/integrations/supabase/client";
import { TipoAtividade } from "@/types";

interface PlanoAulaResponse {
  objetivos: string;
  conteudos: string;
  metodologia: string;
  recursosDidaticos: string;
  avaliacao: string;
  tempoEstimado: string;
}

interface AtividadeResponse {
  enunciado: string;
  criteriosAvaliacao: string;
}

interface SugestaoUnidade {
  tema: string;
  objetivo: string;
}

interface SugestoesResponse {
  sugestoes: SugestaoUnidade[];
}

export async function gerarPlanoAulaIA(params: {
  tema: string;
  disciplina: string;
  anoSerie: string;
  objetivo?: string;
  habilidadesBNCC?: string;
}): Promise<PlanoAulaResponse> {
  const { data, error } = await supabase.functions.invoke("gerar-conteudo", {
    body: {
      tipo: "plano_aula",
      ...params,
    },
  });

  if (error) {
    console.error("Erro ao gerar plano de aula:", error);
    throw new Error(error.message || "Erro ao gerar plano de aula com IA");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as PlanoAulaResponse;
}

export async function gerarAtividadeIA(params: {
  tema: string;
  tipoAtividade: TipoAtividade;
}): Promise<AtividadeResponse> {
  const { data, error } = await supabase.functions.invoke("gerar-conteudo", {
    body: {
      tipo: "atividade_avaliativa",
      ...params,
    },
  });

  if (error) {
    console.error("Erro ao gerar atividade:", error);
    throw new Error(error.message || "Erro ao gerar atividade com IA");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return data as AtividadeResponse;
}

export async function sugerirUnidadesIA(params: {
  disciplina: string;
  anoSerie: string;
}): Promise<SugestaoUnidade[]> {
  const { data, error } = await supabase.functions.invoke("gerar-conteudo", {
    body: {
      tipo: "sugerir_unidades",
      ...params,
    },
  });

  if (error) {
    console.error("Erro ao sugerir unidades:", error);
    throw new Error(error.message || "Erro ao sugerir unidades com IA");
  }

  if (data.error) {
    throw new Error(data.error);
  }

  return (data as SugestoesResponse).sugestoes;
}
