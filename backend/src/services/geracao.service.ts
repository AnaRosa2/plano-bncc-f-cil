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
Professor especialista em BNCC e Cultura Digital.

=== MISSÃO ===
Plano de aula CONCISO sobre "${tema}" para "${disciplina}".

=== REQUISITOS ===
1. Respostas DIRETAS e CURTAS (máx 2 parágrafos por campo).
2. Sem asteriscos (**). Use MAIÚSCULAS para títulos.
3. Prático para aplicação imediata.

=== ESTRUTURA JSON ===
{
  "objetivo": "Objetivos claros e as competências BNCC atingidas.",
  "metodologia": "Passo a passo resumido da aula (4 etapas principais).",
  "meta": "Habilidades desenvolvidas e indicadores de sucesso.",
  "atividade": "Uma proposta de atividade prática rápida sobre o tema."
}

RETORNE APENAS JSON, sem texto adicional:
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
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      objetivo: `OBJETIVO GERAL: Desenvolver compreensão crítica e prática sobre ${tema}, promovendo competências digitais conforme a BNCC.\n\nOBJETIVOS ESPECÍFICOS:\n• Analisar conceitos fundamentais de ${tema} e sua relevância\n• Aplicar conhecimentos em situações práticas\n• Avaliar criticamente informações relacionadas ao tema\n\nCOMPETÊNCIAS BNCC: CG1, CG2, CG5`,
      metodologia: `MOMENTO 1 - ACOLHIMENTO (10 min): Roda de conversa inicial.\n\nMOMENTO 2 - PROBLEMATIZAÇÃO (15 min): Apresentação de situação-problema real.\n\nMOMENTO 3 - DESENVOLVIMENTO (20 min): Exposição dialogada com exemplos contextualizados.\n\nMOMENTO 4 - PRÁTICA (25 min): Atividade colaborativa em grupos.\n\nMOMENTO 5 - SISTEMATIZAÇÃO (15 min): Construção coletiva de síntese.\n\nMOMENTO 6 - ENCERRAMENTO (5 min): Conexão com próxima aula.`,
      meta: `COMPETÊNCIAS GERAIS BNCC:\n• CG5 (Cultura Digital): Compreender e aplicar tecnologias\n• CG2 (Pensamento Científico): Investigar e resolver problemas\n\nINDICADORES DE SUCESSO:\n• Participação ativa nas discussões\n• Conclusão satisfatória das atividades práticas`,
      atividade: `ATIVIDADE PRÁTICA: Projeto em grupos sobre ${tema}\n\nDESCRIÇÃO: Pesquisa guiada e produção de material educativo.\n\nMATERIAIS: Dispositivos digitais, acesso à internet.\n\nPRODUTO FINAL: Apresentação ou infográfico sobre o tema.`
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
      descricao: `Disciplina focada em ${tema} para ${anoSerie}`,
      sugestoesUnidades: [
        { tema: `Introdução ao ${tema}`, objetivo: `Compreender as bases do ${tema}` },
        { tema: `Aplicações de ${tema}`, objetivo: `Praticar conceitos de ${tema} no dia a dia` }
      ]
    };
  }
}

export async function gerarAtividade(tema: string, tipo: string, anoSerie?: string, quantidade = 1) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
${bncc}
Crie ${quantidade} ATIVIDADE(S) AVALIATIVA(S) do tipo ${tipo.toUpperCase()} sobre "${tema}".
Ano/Série: ${anoSerie || 'Geral'}

=== REQUISITOS ===
1. Respostas DIRETAS e CURTAS.
2. Estrutura: Enunciado com contexto e questões claras.
3. Critérios: Divisão simples de pontos.

RETORNE APENAS UM ARRAY JSON:
[{"enunciado": "..", "criteriosAvaliacao": ".."}]
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
    return Array.from({ length: quantidade }, (_, i) => ({
      enunciado: `ATIVIDADE AVALIATIVA (${tipo.toUpperCase()}): ${tema.toUpperCase()}\n\n📌 CONTEXTO:\nConsidere os desafios da Cultura Digital e os impactos de ${tema} na sociedade.\n\n📝 TAREFA:\nAnalise o tema e descreva como podemos utilizar ${tema} de forma ética e eficiente.\n\n⏰ TEMPO: 45 min`,
      criteriosAvaliacao: `📊 CRITÉRIOS DE AVALIAÇÃO:\n- Domínio do tema: 4 pts\n- Clareza e argumentação: 3 pts\n- Proposta de aplicação prática: 3 pts`
    }));
  }
}

export async function sugerirUnidades(disciplina: string, anoSerie?: string, quantidade = 3) {
  try {
    const bncc = await getBnccSnippet();
    const prompt = `
${bncc}
Sugira ${quantidade} temas de aulas para "${disciplina}" (${anoSerie || 'Geral'}).
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
    console.error('Erro ao sugerir unidades:', error);
    return Array.from({ length: quantidade }, (_, i) => ({
      tema: `${disciplina} - Módulo ${i + 1}`,
      objetivo: `Desenvolver competências básicas em ${disciplina}.`
    }));
  }
}
