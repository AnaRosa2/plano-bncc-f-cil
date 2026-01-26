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
    tema: string,
    anoSerie?: string
): Promise<PlanoAulaAPI> {
    console.log(`[apiService] Gerando plano para: ${tema} em ${disciplina} (${anoSerie || 'geral'})`);
    try {
        const response = await fetch(`${API_BASE_URL}/unidades`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ disciplina, tema, anoSerie }),
        });

        if (!response.ok) {
            const errBody = await response.text().catch(() => 'No error body');
            console.error('[apiService] Erro na resposta do backend (Plano):', response.status, errBody);
            throw new Error(`Erro ${response.status} ao gerar plano`);
        }

        const data = await response.json();
        console.log('[apiService] Plano recebido com sucesso');
        return data;
    } catch (error) {
        console.error('[apiService] Falha na requisição de Plano:', error);
        throw error;
    }
}

// Gerar atividade avaliativa com IA
export async function gerarAtividadeAPI(
    tema: string,
    tipo: string,
    anoSerie?: string
): Promise<AtividadeAPI> {
    console.log(`[apiService] Gerando atividade tipo ${tipo} para: ${tema}`);
    try {
        const response = await fetch(`${API_BASE_URL}/atividades/gerar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tema, tipo, anoSerie, quantidade: 1 }),
        });

        if (!response.ok) {
            const errBody = await response.text().catch(() => 'No error body');
            console.error('[apiService] Erro na resposta do backend (Atividade):', response.status, errBody);
            throw new Error(`Erro ${response.status} ao gerar atividade`);
        }

        const result = await response.json();
        console.log('[apiService] Atividade recebida com sucesso');
        return Array.isArray(result) ? result[0] : result;
    } catch (error) {
        console.error('[apiService] Falha na requisição de Atividade:', error);
        throw error;
    }
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
