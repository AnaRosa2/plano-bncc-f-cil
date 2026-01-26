// API Service para comunicação com o backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface PlanoAulaAPI {
    planoDeAula: string;
    objetivo: string;
    metodologia: string;
    meta: string;
    atividade: string;
}

export interface AtividadeAPI {
    enunciado: string;
    criteriosAvaliacao: string;
}

export interface SugestaoUnidade {
    tema: string;
    objetivo: string;
}

// Gerar plano de aula com IA
export async function gerarPlanoAulaAPI(
    disciplina: string,
    tema: string
): Promise<PlanoAulaAPI> {
    const response = await fetch(`${API_BASE_URL}/unidades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disciplina, tema }),
    });

    if (!response.ok) {
        throw new Error('Erro ao gerar plano de aula');
    }

    return await response.json();
}

// Gerar atividade avaliativa com IA
export async function gerarAtividadeAPI(
    tema: string,
    tipo: string,
    anoSerie?: string
): Promise<AtividadeAPI> {
    const response = await fetch(`${API_BASE_URL}/atividades/gerar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tema, tipo, anoSerie, quantidade: 1 }),
    });

    if (!response.ok) {
        throw new Error('Erro ao gerar atividade');
    }

    const result = await response.json();
    // A API retorna um array, pegamos o primeiro item
    return Array.isArray(result) ? result[0] : result;
}

// Sugerir unidades com IA
export async function sugerirUnidadesAPI(
    disciplina: string,
    anoSerie?: string,
    quantidade: number = 3
): Promise<SugestaoUnidade[]> {
    const response = await fetch(`${API_BASE_URL}/unidades/sugerir-tema`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disciplina, anoSerie, quantidade }),
    });

    if (!response.ok) {
        throw new Error('Erro ao sugerir unidades');
    }

    return await response.json();
}

// Interface para slides
export interface SlideAPI {
    titulo: string;
    subtitulo?: string;
    conteudo: string;
    tipo: 'titulo' | 'conteudo' | 'questao' | 'conclusao' | 'pratica';
    icon?: string;
}

// Gerar slides educacionais com IA (RF06)
export async function gerarSlidesAPI(
    tema: string,
    disciplina: string,
    anoSerie?: string
): Promise<SlideAPI[]> {
    const response = await fetch(`${API_BASE_URL}/unidades/slides`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tema, disciplina, anoSerie }),
    });

    if (!response.ok) {
        throw new Error('Erro ao gerar slides');
    }

    return await response.json();
}
