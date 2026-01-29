// API Service para comunicação com o backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export interface PlanoAulaAPI {
    planoDeAula: string;
    objetivo: string;
    metodologia: string;
    meta: string;
    atividade: string;
    recursos?: string;
    tempoEstimado?: string;
    atividadeCompleta?: {
        titulo: string;
        enunciado: string;
        criteriosAvaliacao: string;
        tipo: string;
    };
}

export interface AtividadeAPI {
    enunciado: string;
    criteriosAvaliacao: string;
}

export interface SugestaoUnidade {
    tema: string;
    objetivo: string;
}

export interface DetalhesUnidadeAPI {
    objetivo: string;
    habilidades: string;
}

// Auxiliar para tratar erros da API
async function handleApiResponse(response: Response, defaultMsg: string) {
    if (!response.ok) {
        try {
            const errorData = await response.json();
            throw new Error(errorData.message || errorData.error || defaultMsg);
        } catch (e: any) {
            if (e.message) throw e;
            const text = await response.text().catch(() => defaultMsg);
            throw new Error(text || defaultMsg);
        }
    }
    return response.json();
}

// Gerar plano de aula com IA
export async function gerarPlanoAulaAPI(
    disciplina: string,
    tema: string,
    anoSerie?: string,
    metodologiaId?: string
): Promise<PlanoAulaAPI & { metodologiaId?: string }> {
    console.log(`[apiService] Gerando plano para: ${tema} em ${disciplina} (${anoSerie || 'geral'}) ${metodologiaId ? `usando ${metodologiaId}` : ''}`);
    const response = await fetch(`${API_BASE_URL}/unidades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disciplina, tema, anoSerie, metodologiaId }),
    });
    return handleApiResponse(response, 'Falha ao gerar plano de aula');
}

// Gerar atividade avaliativa com IA
export async function gerarAtividadeAPI(
    tema: string,
    tipo: string,
    anoSerie?: string
): Promise<AtividadeAPI> {
    console.log(`[apiService] Gerando atividade tipo ${tipo} para: ${tema}`);
    const response = await fetch(`${API_BASE_URL}/atividades/gerar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema, tipo, anoSerie, quantidade: 10 }),
    });
    const result = await handleApiResponse(response, 'Falha ao gerar atividade');
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

    return handleApiResponse(response, 'Falha ao sugerir unidades');
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

    return handleApiResponse(response, 'Falha ao gerar slides');
}

// Sugerir detalhes da unidade (Objetivo e BNCC) com IA
export async function sugerirDetalhesUnidadeAPI(
    disciplina: string,
    tema: string,
    anoSerie?: string
): Promise<DetalhesUnidadeAPI> {
    const response = await fetch(`${API_BASE_URL}/unidades/sugerir-detalhes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ disciplina, tema, anoSerie }),
    });

    return handleApiResponse(response, 'Falha ao sugerir detalhes com IA');
}
