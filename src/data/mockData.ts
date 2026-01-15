import { Disciplina, Unidade, PlanoAula, AtividadeAvaliativa } from '@/types';

// Dados iniciais de exemplo para demonstração
export const disciplinasIniciais: Disciplina[] = [
  {
    id: '1',
    nome: 'Cultura Digital',
    anoSerie: '8º ano EF',
    descricao: 'Exploração de ferramentas digitais, cidadania digital e pensamento computacional.',
    criadoEm: new Date('2026-01-10'),
  },
  {
    id: '2',
    nome: 'Tecnologia e Sociedade',
    anoSerie: '1º ano EM',
    descricao: 'Impactos da tecnologia na sociedade contemporânea e ética digital.',
    criadoEm: new Date('2026-01-12'),
  },
];

export const unidadesIniciais: Unidade[] = [
  {
    id: '1',
    disciplinaId: '1',
    tema: 'Introdução à Cidadania Digital',
    objetivoGeral: 'Compreender os princípios básicos de cidadania digital e comportamento ético online.',
    habilidadesBNCC: 'EF08CI01 - Identificar e classificar diferentes fontes de informação digital.',
    criadoEm: new Date('2026-01-11'),
  },
  {
    id: '2',
    disciplinaId: '1',
    tema: 'Segurança na Internet',
    objetivoGeral: 'Desenvolver práticas seguras de navegação e proteção de dados pessoais.',
    habilidadesBNCC: 'EF08CI02 - Analisar criticamente a exposição pessoal em ambientes digitais.',
    criadoEm: new Date('2026-01-12'),
  },
];

export const planosAulaIniciais: PlanoAula[] = [
  {
    id: '1',
    unidadeId: '1',
    objetivos: '• Definir cidadania digital e sua importância\n• Identificar comportamentos éticos online\n• Reconhecer direitos e deveres no ambiente digital',
    conteudos: '• Conceito de cidadania digital\n• Netiqueta e comportamento online\n• Direitos autorais básicos\n• Respeito à diversidade online',
    metodologia: '• Aula expositiva dialogada (15 min)\n• Discussão em grupos sobre casos reais (20 min)\n• Atividade prática: criação de regras de convivência digital (15 min)',
    recursosDidaticos: '• Projetor e slides\n• Computadores ou tablets\n• Quadro branco\n• Fichas de atividade impressas',
    avaliacao: 'Participação nas discussões e qualidade das regras elaboradas em grupo.',
    tempoEstimado: '50 minutos',
    geradoPorIA: true,
  },
];

export const atividadesAvaliativasIniciais: AtividadeAvaliativa[] = [
  {
    id: '1',
    unidadeId: '1',
    enunciado: 'Analise a situação abaixo e responda:\n\nMaria encontrou uma foto engraçada de sua colega Ana nas redes sociais. Sem pedir permissão, Maria compartilhou a foto em seu perfil, adicionando uma legenda que fazia piadas sobre a aparência de Ana.\n\n1. Quais princípios de cidadania digital Maria desrespeitou?\n2. Como essa ação pode afetar Ana?\n3. O que Maria deveria ter feito antes de compartilhar a foto?\n4. Elabore 3 regras de convivência digital que poderiam prevenir situações como essa.',
    tipo: 'discursiva',
    criteriosAvaliacao: '• Identificação correta dos princípios violados (2,5 pontos)\n• Análise dos impactos emocionais e sociais (2,5 pontos)\n• Proposta de ação adequada (2,5 pontos)\n• Qualidade e aplicabilidade das regras propostas (2,5 pontos)',
    geradoPorIA: true,
  },
];

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
export const sugestoesUnidades = {
  'Cultura Digital': [
    { tema: 'Cidadania Digital e Netiqueta', objetivo: 'Compreender comportamentos éticos e responsáveis no ambiente digital' },
    { tema: 'Segurança na Internet', objetivo: 'Desenvolver práticas seguras de navegação e proteção de dados' },
    { tema: 'Fake News e Desinformação', objetivo: 'Identificar e combater a propagação de notícias falsas' },
    { tema: 'Direitos Autorais e Creative Commons', objetivo: 'Entender a importância do respeito à propriedade intelectual' },
    { tema: 'Pegada Digital e Privacidade', objetivo: 'Refletir sobre a exposição pessoal nas redes' },
  ],
  'Tecnologia e Sociedade': [
    { tema: 'Impactos da IA na Sociedade', objetivo: 'Analisar as transformações causadas pela inteligência artificial' },
    { tema: 'Ética e Tecnologia', objetivo: 'Discutir dilemas éticos relacionados ao uso de tecnologias' },
    { tema: 'Inclusão Digital', objetivo: 'Compreender a importância do acesso igualitário à tecnologia' },
    { tema: 'Sustentabilidade Digital', objetivo: 'Explorar o impacto ambiental da tecnologia' },
  ],
  default: [
    { tema: 'Introdução à Cultura Digital', objetivo: 'Apresentar conceitos básicos de cultura digital' },
    { tema: 'Ferramentas Digitais para Aprendizagem', objetivo: 'Explorar recursos tecnológicos educacionais' },
    { tema: 'Comunicação Digital', objetivo: 'Desenvolver habilidades de comunicação em ambientes virtuais' },
  ],
};
