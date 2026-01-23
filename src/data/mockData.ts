import { Disciplina, Unidade, PlanoAula, AtividadeAvaliativa } from '@/types';

// Dados iniciais de exemplo para demonstração
// Arrays esvaziados conforme solicitado (site "zerado")
export const disciplinasIniciais: Disciplina[] = [];

export const unidadesIniciais: Unidade[] = [];

export const planosAulaIniciais: PlanoAula[] = [];

export const atividadesAvaliativasIniciais: AtividadeAvaliativa[] = [];

// Templates para geração de conteúdo pela "IA" (simulação)
export const templatesPlanoAula = {
  objetivos: (tema: string) => `• Compreender os conceitos fundamentais de ${tema}\n• Desenvolver habilidades práticas relacionadas ao tema\n• Aplicar conhecimentos em situações do cotidiano\n• Refletir criticamente sobre o uso responsável da tecnologia`,
  conteudos: (tema: string) => `• Introdução e contextualização de ${tema}\n• Conceitos-chave e terminologia\n• Exemplos práticos e casos reais\n• Boas práticas e recomendações\n• Conexão com a BNCC e cultura digital`,
  metodologia: () => `• Momento inicial: Levantamento de conhecimentos prévios (10 min)\n• Desenvolvimento: Aula expositiva dialogada com recursos multimídia (20 min)\n• Atividade prática: Trabalho em grupos (15 min)\n• Fechamento: Síntese coletiva e reflexão (5 min)`,
  recursosDidaticos: () => `• Computadores ou tablets com acesso à internet\n• Projetor multimídia\n• Quadro branco ou lousa digital\n• Material impresso de apoio\n• Plataforma de colaboração online`,
  avaliacao: () => `• Observação da participação e engajamento dos alunos\n• Qualidade das contribuições nas discussões\n• Produto final da atividade prática\n• Autoavaliação reflexiva`,
  tempoEstimado: () => '50 minutos (1 hora-aula)',
};

export const templatesAtividade = {
  objetiva: (tema: string) => ({
    enunciado: `Questionário sobre ${tema}\n\n1. Qual é a principal característica de ${tema}?\na) Opção A\nb) Opção B\nc) Opção C\nd) Opção D\n\n2. Em relação às boas práticas de ${tema}, é correto afirmar que:\na) Opção A\nb) Opção B\nc) Opção C\nd) Opção D\n\n3. Segundo a BNCC, o desenvolvimento de habilidades em ${tema} contribui para:\na) Opção A\nb) Opção B\nc) Opção C\nd) Opção D`,
    criteriosAvaliacao: '• Cada questão vale 3,33 pontos\n• Nota final: soma das questões corretas\n• Gabarito disponível para o professor',
  }),
  discursiva: (tema: string) => ({
    enunciado: `Atividade Reflexiva sobre ${tema}\n\n1. Descreva com suas palavras o que você entende por ${tema} e qual sua importância no contexto atual.\n\n2. Apresente um exemplo prático de como ${tema} pode ser aplicado no seu dia a dia.\n\n3. Quais cuidados devemos ter ao lidar com ${tema}? Justifique sua resposta.\n\n4. Como a escola pode contribuir para o desenvolvimento de competências relacionadas a ${tema}?`,
    criteriosAvaliacao: '• Clareza e coerência textual (2,5 pontos)\n• Demonstração de compreensão do tema (2,5 pontos)\n• Qualidade dos exemplos apresentados (2,5 pontos)\n• Capacidade de reflexão crítica (2,5 pontos)',
  }),
  pratica: (tema: string) => ({
    enunciado: `Projeto Prático: ${tema}\n\nObjetivo: Desenvolver um produto digital que demonstre sua compreensão sobre ${tema}.\n\nInstruções:\n1. Forme um grupo de 3 a 4 integrantes\n2. Escolham uma das opções de produto:\n   - Apresentação digital (slides)\n   - Vídeo curto (máximo 3 minutos)\n   - Infográfico digital\n   - Podcast (máximo 5 minutos)\n\n3. O produto deve abordar:\n   - O que é ${tema}\n   - Por que é importante\n   - Dicas práticas para o dia a dia\n   - Conexão com a cultura digital\n\n4. Apresentem o trabalho para a turma`,
    criteriosAvaliacao: '• Qualidade técnica do produto (2,5 pontos)\n• Profundidade do conteúdo (2,5 pontos)\n• Criatividade e originalidade (2,5 pontos)\n• Trabalho em equipe e apresentação (2,5 pontos)',
  }),
};

// Sugestões de unidades por disciplina (simulação de IA)
// Mantemos apenas o padrão vazio para começar "do zero"; professores podem gerar sugestões via IA
export const sugestoesUnidades: Record<string, { tema: string; objetivo: string }[]> = {
  default: []
};
// src/data/mockData.ts

// Trechos da BNCC sobre Cultura Digital (RAG)
export const BNCC_CULTURA_DIGITAL = `
Competência Geral 5 da BNCC:
"Utilizar tecnologias digitais de forma crítica, ética e responsável, compreendendo seus impactos sociais, culturais e políticos."

Diretrizes da BNCC para Computação:
- Educação Infantil: "Criar e testar algoritmos brincando com objetos do ambiente."
- Ensino Fundamental: "Desenvolver pensamento computacional, resolver problemas com decomposição."
- Ensino Médio: "Analisar criticamente artefatos computacionais, garantir privacidade e segurança."

Habilidades por etapa:
- EF08CI01: "Identificar e classificar diferentes fontes de informação digital."
- EF08CI02: "Analisar criticamente a exposição pessoal em ambientes digitais."
- EM13CO14: "Avaliar a confiabilidade das informações em meio digital."
`;