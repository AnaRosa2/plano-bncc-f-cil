// Serviço para geração de links do Canva com templates pré-preenchidos
import { Disciplina, Unidade, PlanoAula, AtividadeAvaliativa } from '@/types';

// Base URL do Canva para criação de designs
const CANVA_CREATE_URL = 'https://www.canva.com/design/create';

// IDs de templates educacionais do Canva (públicos)
const CANVA_TEMPLATES = {
  presentation: 'DAGGKh-n5eQ', // Template de apresentação educacional
  slides: 'DAGGKiJvr8U', // Template de slides de aula
};

export interface DadosSlides {
  disciplina: Disciplina;
  unidade: Unidade;
  planoAula?: PlanoAula;
  atividadeAvaliativa?: AtividadeAvaliativa;
}

/**
 * Gera conteúdo formatado para os slides do Canva
 */
function formatarConteudoSlides(dados: DadosSlides): string {
  const { disciplina, unidade, planoAula, atividadeAvaliativa } = dados;
  
  const linhas = [
    `SLIDE 1 - TÍTULO`,
    `${disciplina.nome}`,
    `${unidade.tema}`,
    `${disciplina.anoSerie}`,
    ``,
    `SLIDE 2 - OBJETIVO E BNCC`,
    `Objetivo: ${unidade.objetivoGeral}`,
    `Alinhamento BNCC: Competência Geral 5 - Cultura Digital`,
    unidade.habilidadesBNCC ? `Habilidades: ${unidade.habilidadesBNCC}` : '',
    ``,
  ];
  
  if (planoAula) {
    linhas.push(
      `SLIDE 3 - CONTEÚDOS`,
      planoAula.conteudos,
      ``,
      `SLIDE 4 - METODOLOGIA`,
      planoAula.metodologia,
      ``,
      `SLIDE 5 - ATIVIDADE PRÁTICA`,
    );
  }
  
  if (atividadeAvaliativa) {
    linhas.push(
      atividadeAvaliativa.enunciado.substring(0, 200) + '...',
      ``,
      `SLIDE 6 - AVALIAÇÃO`,
      atividadeAvaliativa.criteriosAvaliacao,
    );
  }
  
  return linhas.filter(l => l !== undefined).join('\n');
}

/**
 * Gera um link para criar um novo design no Canva com texto pré-preenchido
 * Abre o editor do Canva com o template selecionado
 */
export function gerarLinkCanvaApresentacao(dados: DadosSlides): string {
  const { disciplina, unidade } = dados;
  
  // Título do design
  const titulo = encodeURIComponent(
    `${disciplina.nome} - ${unidade.tema.substring(0, 40)}`
  );
  
  // O Canva não suporta pré-preenchimento de texto via URL diretamente,
  // mas podemos direcionar para criar uma apresentação com título específico
  // e fornecer o conteúdo para copiar
  
  // Link para criar uma apresentação em branco
  const url = `https://www.canva.com/design/create?type=presentation&title=${titulo}`;
  
  return url;
}

/**
 * Abre o Canva em uma nova aba com template de apresentação
 */
export function abrirCanvaApresentacao(dados: DadosSlides): void {
  const url = gerarLinkCanvaApresentacao(dados);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copia o conteúdo dos slides para a área de transferência
 * O usuário pode colar no Canva
 */
export async function copiarConteudoSlides(dados: DadosSlides): Promise<void> {
  const conteudo = formatarConteudoSlides(dados);
  await navigator.clipboard.writeText(conteudo);
}

/**
 * Gera estrutura de slides em formato Markdown para fácil visualização
 */
export function gerarEstruturaSlides(dados: DadosSlides): string[] {
  const { disciplina, unidade, planoAula, atividadeAvaliativa } = dados;
  
  const slides: string[] = [];
  
  // Slide 1: Título
  slides.push(`
📌 **SLIDE 1 - CAPA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎓 ${disciplina.nome}
📚 ${unidade.tema}
📅 ${disciplina.anoSerie}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim());
  
  // Slide 2: Objetivo e BNCC
  slides.push(`
📌 **SLIDE 2 - OBJETIVO**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 **Objetivo:**
${unidade.objetivoGeral}

🏛️ **Alinhamento BNCC:**
Competência Geral 5 - Cultura Digital
${unidade.habilidadesBNCC ? `\n📋 ${unidade.habilidadesBNCC}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim());
  
  if (planoAula) {
    // Slide 3: Conteúdos
    slides.push(`
📌 **SLIDE 3 - CONTEÚDOS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 ${planoAula.conteudos}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim());
    
    // Slide 4: Metodologia
    slides.push(`
📌 **SLIDE 4 - METODOLOGIA**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ ${planoAula.metodologia}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim());
    
    // Slide 5: Recursos
    slides.push(`
📌 **SLIDE 5 - RECURSOS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛠️ ${planoAula.recursosDidaticos}

⏱️ **Tempo:** ${planoAula.tempoEstimado}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim());
  }
  
  if (atividadeAvaliativa) {
    // Slide 6: Atividade
    slides.push(`
📌 **SLIDE 6 - ATIVIDADE**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✏️ **${atividadeAvaliativa.tipo === 'objetiva' ? 'Questões Objetivas' : 
       atividadeAvaliativa.tipo === 'discursiva' ? 'Questões Discursivas' : 
       'Atividade Prática'}**

${atividadeAvaliativa.enunciado.substring(0, 300)}${atividadeAvaliativa.enunciado.length > 300 ? '...' : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim());
  }
  
  // Slide final: Referências
  slides.push(`
📌 **SLIDE FINAL - REFERÊNCIAS**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 **Base Nacional Comum Curricular (BNCC)**
   Competência Geral 5: Cultura Digital

🔗 **Recursos utilizados:**
   • Materiais disponibilizados pelo professor
   • Atividades práticas em sala

💡 **Dúvidas?**
   Procure o professor!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim());
  
  return slides;
}

/**
 * Gera link do Canva para um template específico de educação
 */
export function gerarLinkTemplateEducacional(): string {
  // Link para busca de templates educacionais no Canva
  return 'https://www.canva.com/templates/?query=education%20presentation&category=tACFasDnyEQ';
}
