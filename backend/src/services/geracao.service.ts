// src/services/geracao.service.ts
import { gerarTextoComIA } from './ai-gemini.service';
import { getBnccText } from '../utils/bncc';

async function getBnccSnippet() {
  return await getBnccText();
}

export async function gerarConteudo(disciplina: string, tema: string) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
=== MISSÃO ===
Plano de aula CONCISO sobre "${tema}" para a disciplina "${disciplina}".
Siga rigorosamente a BNCC (ver referência ao final).

=== REQUISITOS ===
1. Respostas DIRETAS (máx 2 parágrafos por campo).
2. Sem asteriscos (**). Use MAIÚSCULAS para títulos.
3. Prático e pronto para sala de aula.

=== ESTRUTURA JSON ===
{
  "objetivo": "Objetivos claros e códigos BNCC.",
  "metodologia": "Passo a passo resumido da aula.",
  "meta": "Habilidades desenvolvidas.",
  "atividade": "Proposta de atividade prática sobre o tema."
}

=== REFERÊNCIA BNCC ===
${bncc}

RETORNE APENAS JSON, sem texto adicional:
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON não encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    const conteudo = JSON.parse(jsonStr);
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      ...conteudo
    };
  } catch (error) {
    console.error('❌ Erro na geração de conteúdo:', error);
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      objetivo: `OBJETIVO: Desenvolver compreensão sobre ${tema} alinhado à BNCC.`,
      metodologia: `1. Acolhimento e debate inicial.\n2. Exposição dialogada.\n3. Atividade em grupo.\n4. Síntese final.`,
      meta: `Competências de Cultura Digital e Pensamento Crítico.`,
      atividade: `ATIVIDADE: Criação de um mapa mental ou debate sobre ${tema}.`
    };
  }
}

export async function gerarDisciplina(anoSerie: string, tema: string) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
Crie uma disciplina de Cultura Digital para ${anoSerie} focada em ${tema}.
Use a BNCC como base:
${bncc}

RETORNE APENAS JSON:
{
  "nome": "Nome da disciplina",
  "descricao": "Descrição concisa",
  "sugestoesUnidades": [{ "tema": "..", "objetivo": ".." }]
}
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('JSON não encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (err) {
    return {
      nome: `Disciplina de ${tema}`,
      descricao: `Foco em ${tema} (${anoSerie})`,
      sugestoesUnidades: [{ tema: `Fundamentos de ${tema}`, objetivo: `Introduzir conceitos de ${tema}` }]
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  try {
    const instrucoesDetalhadas: Record<string, string> = {
      objetiva: `ATIVIDADE OBJETIVA: 5 questões de múltipla escolha (A, B, C, D) com situação-problema.`,
      discursiva: `ATIVIDADE DISCURSIVA: 4 questões reflexivas que exijam argumentação sobre o tema.`,
      pratica: `ATIVIDADE PRÁTICA: Roteiro para projeto mão-na-massa com etapas e materiais.`
    };

    const bncc = await getBnccSnippet();
    const prompt = `
Crie ${quantidade} ATIVIDADE(S) do tipo ${tipo.toUpperCase()} sobre "${tema}".
Ano/Série: ${anoSerie || 'Geral'}

=== REQUISITOS ESPECÍFICOS ===
${instrucoesDetalhadas[tipo] || instrucoesDetalhadas['discursiva']}

=== REQUISITOS GERAIS ===
1. Respostas DIRETAS. Sem asteriscos (**). Use MAIÚSCULAS para títulos.
2. Alinhado à BNCC (ver referência abaixo).

=== ESTRUTURA JSON (ARRAY [{}]) ===
{
  "enunciado": "CONTEXTO + INSTRUÇÕES + QUESTÕES",
  "criteriosAvaliacao": "PONTOS E CRITÉRIOS"
}

=== REFERÊNCIA BNCC ===
${bncc}

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

    // Fallback inteligente baseado no TIPO
    if (tipo === 'objetiva') {
      return [{
        enunciado: `ATIVIDADE OBJETIVA: ${tema.toUpperCase()}\n\n1. Qual das alternativas abaixo melhor descreve o impacto de ${tema} na sociedade digital?\nA) Opção 1\nB) Opção 2\nC) Opção 3\nD) Opção 4\n\n(IA em manutenção, personalize as opções acima)`,
        criteriosAvaliacao: `1 pt por questão correta.`
      }];
    } else if (tipo === 'pratica') {
      return [{
        enunciado: `ATIVIDADE PRÁTICA: ${tema.toUpperCase()}\n\nPASSO 1: Pesquisa inicial.\nPASSO 2: Produção do material.\nPASSO 3: Apresentação para a turma.\n\nFoco no uso ético de ${tema}.`,
        criteriosAvaliacao: `Qualidade do projeto: 6 pts\nApresentação: 4 pts`
      }];
    }

    return [{
      enunciado: `ATIVIDADE DISCURSIVA: ${tema.toUpperCase()}\n\nAnalise o tema e descreva como podemos utilizar ${tema} para promover uma cultura digital consciente e ética.\n\nQUESTÃO 1: Como ${tema} afeta seu cotidiano?\nQUESTÃO 2: Proponha uma melhoria.`,
      criteriosAvaliacao: `Domínio do tema: 5 pts\nArgumentação: 5 pts`
    }];
  }
}

export async function sugerirUnidades(disciplina: string, anoSerie?: string, quantidade = 3) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
Sugira ${quantidade} temas de aulas para "${disciplina}" (${anoSerie || 'Geral'}).
Use a BNCC: ${bncc}
RETORNE APENAS UM ARRAY JSON: [{"tema":"..","objetivo":".."}]
`;

    const respostaBruta = await gerarTextoComIA(prompt);
    const jsonMatch = respostaBruta.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('JSON não encontrado');

    let jsonStr = jsonMatch[0].replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(jsonStr);
    return parsed.slice(0, quantidade).map((p: any) => ({
      tema: p.tema || p.title || p.nome || 'Unidade Sugerida',
      objetivo: p.objetivo || p.descricao || 'Entender conceitos básicos da unidade.'
    }));
  } catch (error) {
    return Array.from({ length: quantidade }, (_, i) => ({
      tema: `${disciplina} - Tema ${i + 1}`,
      objetivo: `Desenvolver competências em ${disciplina}.`
    }));
  }
}
