// Tipos para o sistema de planejamento educacional

export interface Disciplina {
  id: string;
  nome: string;
  anoSerie: string;
  descricao?: string;
  criadoEm: Date;
}

export interface Unidade {
  id: string;
  disciplinaId: string;
  tema: string;
  objetivoGeral: string;
  habilidadesBNCC: string;
  planoAula?: PlanoAula;
  atividadeAvaliativa?: AtividadeAvaliativa;
  criadoEm: Date;
}

export interface PlanoAula {
  id: string;
  unidadeId: string;
  objetivos: string;
  conteudos: string;
  metodologia: string;
  recursosDidaticos: string;
  avaliacao: string;
  tempoEstimado: string;
  geradoPorIA: boolean;
}

export interface AtividadeAvaliativa {
  id: string;
  unidadeId: string;
  enunciado: string;
  tipo: 'objetiva' | 'discursiva' | 'pratica';
  criteriosAvaliacao: string;
  geradoPorIA: boolean;
}

export type TipoAtividade = 'objetiva' | 'discursiva' | 'pratica';

export const TIPOS_ATIVIDADE: { value: TipoAtividade; label: string }[] = [
  { value: 'objetiva', label: 'Objetiva (múltipla escolha)' },
  { value: 'discursiva', label: 'Discursiva (resposta aberta)' },
  { value: 'pratica', label: 'Prática (projeto/atividade)' },
];

export const ANOS_SERIES = [
  '1º ano EF',
  '2º ano EF',
  '3º ano EF',
  '4º ano EF',
  '5º ano EF',
  '6º ano EF',
  '7º ano EF',
  '8º ano EF',
  '9º ano EF',
  '1º ano EM',
  '2º ano EM',
  '3º ano EM',
];

export const DISCIPLINAS_SUGERIDAS = [
  'Português',
  'Matemática',
  'História',
  'Geografia',
  'Ciências',
  'Biologia',
  'Física',
  'Química',
  'Artes',
  'Educação Física',
  'Inglês',
  'Filosofia',
  'Sociologia',
];
