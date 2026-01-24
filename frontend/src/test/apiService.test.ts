import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
    gerarPlanoAulaAPI,
    gerarAtividadeAPI,
    sugerirUnidadesAPI
} from '@/services/apiService';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('apiService', () => {
    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe('gerarPlanoAulaAPI', () => {
        it('deve chamar a API corretamente com disciplina e tema', async () => {
            const mockResponse = {
                planoDeAula: 'Plano sobre Fake News',
                objetivo: 'Identificar fake news',
                metodologia: 'Debate em grupo',
                meta: 'Desenvolver senso crítico',
                atividade: 'Análise de notícias'
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockResponse)
            });

            const resultado = await gerarPlanoAulaAPI('Cultura Digital', 'Fake News');

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/unidades'),
                expect.objectContaining({
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ disciplina: 'Cultura Digital', tema: 'Fake News' })
                })
            );
            expect(resultado).toEqual(mockResponse);
        });

        it('deve lançar erro quando a API retorna erro', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 500
            });

            await expect(gerarPlanoAulaAPI('Teste', 'Tema')).rejects.toThrow('Erro ao gerar plano de aula');
        });
    });

    describe('gerarAtividadeAPI', () => {
        it('deve chamar a API com tema, tipo e anoSerie', async () => {
            const mockAtividade = {
                enunciado: 'Questão sobre segurança digital',
                criteriosAvaliacao: 'Participação e conteúdo'
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([mockAtividade])
            });

            const resultado = await gerarAtividadeAPI('Segurança Digital', 'discursiva', '6º ano EF');

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/atividades/gerar'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        tema: 'Segurança Digital',
                        tipo: 'discursiva',
                        anoSerie: '6º ano EF',
                        quantidade: 1
                    })
                })
            );
            expect(resultado).toEqual(mockAtividade);
        });

        it('deve retornar primeiro item quando API retorna array', async () => {
            const mockAtividades = [
                { enunciado: 'Primeira', criteriosAvaliacao: 'Critério 1' },
                { enunciado: 'Segunda', criteriosAvaliacao: 'Critério 2' }
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockAtividades)
            });

            const resultado = await gerarAtividadeAPI('Tema', 'objetiva');
            expect(resultado.enunciado).toBe('Primeira');
        });
    });

    describe('sugerirUnidadesAPI', () => {
        it('deve chamar a API com disciplina e quantidade', async () => {
            const mockSugestoes = [
                { tema: 'Fake News', objetivo: 'Identificar desinformação' },
                { tema: 'Cyberbullying', objetivo: 'Prevenir assédio online' },
                { tema: 'Privacidade', objetivo: 'Proteger dados pessoais' }
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSugestoes)
            });

            const resultado = await sugerirUnidadesAPI('Cultura Digital', '7º ano EF', 3);

            expect(mockFetch).toHaveBeenCalledWith(
                expect.stringContaining('/unidades/sugerir-tema'),
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify({
                        disciplina: 'Cultura Digital',
                        anoSerie: '7º ano EF',
                        quantidade: 3
                    })
                })
            );
            expect(resultado).toHaveLength(3);
            expect(resultado[0].tema).toBe('Fake News');
        });

        it('deve usar quantidade padrão quando não especificada', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve([])
            });

            await sugerirUnidadesAPI('Matemática');

            expect(mockFetch).toHaveBeenCalledWith(
                expect.any(String),
                expect.objectContaining({
                    body: expect.stringContaining('"quantidade":3')
                })
            );
        });
    });
});
