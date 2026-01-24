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

Crie UM ÚNICO plano de aula sobre "${tema}" para a disciplina "${disciplina}".
Siga EXATAMENTE estas regras:
1. Responda APENAS com um objeto JSON
2. NÃO use colchetes [] (não é array)
3. NÃO adicione texto antes ou depois do JSON
4. Use ESTA estrutura exata:
{"objetivo":"...","metodologia":"...","meta":"...","atividade":"..."}

Exemplo válido:
{"objetivo":"Ensinar o uso ético da tecnologia.","metodologia":"Debate em grupo.","meta":"Desenvolver senso crítico digital.","atividade":"Criar um guia de boas práticas online."}
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
    console.error('Erro ao parsear JSON:', respostaBruta);
    // Fallback pedagógico
    return {
      planoDeAula: `Plano de aula sobre ${tema} na disciplina ${disciplina}`,
      objetivo: `Explorar o tema "${tema}" com foco em Cultura Digital.`,
      metodologia: "Aula dialogada com análise crítica de fontes digitais.",
      meta: "Desenvolver competência digital conforme a BNCC.",
      atividade: `Pesquisa guiada sobre "${tema}" com produção de relatório ético-digital.`
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

  const instrucoes: Record<string, string> = {
    objetiva: 'Crie 5 questões de múltipla escolha com 4 alternativas',
    discursiva: 'Crie 4 questões abertas reflexivas',
    pratica: 'Crie um projeto prático em grupo'
  };

  const bncc = await getBnccSnippet();
  console.log('[geracao.service] BNCC snippet length:', bncc?.length || 0);

  const prompt = `
${bncc}

Crie ${quantidade} ATIVIDADE(S) AVALIATIVA(S) ${tipo.toUpperCase()}.
Tema: "${tema}"
Ano/Série: ${anoSerie || 'N/A'}

${instrucoes[tipo] || instrucoes['discursiva']}

Critérios de avaliação claros e baseados na BNCC.

RETORNE APENAS JSON (ARRAY) no formato:
[
  {"enunciado": "Texto completo da atividade com instruções","criteriosAvaliacao":"..."}
]
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
    // Fallback: criar quantidade de atividades simples
    const fallback = Array.from({ length: quantidade }, (_, i) => ({
      enunciado: `Atividade ${i + 1} sobre ${tema}: ${tipo}`,
      criteriosAvaliacao: '• Participação (X pontos)\n• Conteúdo (X pontos)'
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