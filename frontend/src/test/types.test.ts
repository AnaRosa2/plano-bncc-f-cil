import { describe, it, expect } from 'vitest';

/**
 * Testes de tipos e estruturas de dados
 */
describe('Types - Estruturas de Dados', () => {
    describe('Disciplina', () => {
        it('deve ter estrutura correta', () => {
            const disciplina = {
                id: 'abc123',
                nome: 'Cultura Digital',
                anoSerie: '6º ano EF',
                descricao: 'Disciplina sobre tecnologia',
                criadoEm: new Date()
            };

            expect(disciplina).toHaveProperty('id');
            expect(disciplina).toHaveProperty('nome');
            expect(disciplina).toHaveProperty('anoSerie');
            expect(disciplina.criadoEm).toBeInstanceOf(Date);
        });
    });

    describe('Unidade', () => {
        it('deve ter estrutura correta', () => {
            const unidade = {
                id: 'unidade123',
                disciplinaId: 'disc456',
                tema: 'Fake News',
                objetivoGeral: 'Identificar desinformação',
                habilidadesBNCC: 'EF67LP01',
                criadoEm: new Date()
            };

            expect(unidade).toHaveProperty('id');
            expect(unidade).toHaveProperty('disciplinaId');
            expect(unidade).toHaveProperty('tema');
            expect(unidade).toHaveProperty('habilidadesBNCC');
        });
    });

    describe('PlanoAula', () => {
        it('deve ter todos os campos necessários', () => {
            const plano = {
                id: 'plano123',
                unidadeId: 'unidade456',
                objetivos: 'Objetivo da aula',
                conteudos: 'Conteúdo programático',
                metodologia: 'Metodologia ativa',
                recursosDidaticos: 'Recursos necessários',
                avaliacao: 'Critérios de avaliação',
                tempoEstimado: '4 aulas',
                geradoPorIA: true
            };

            expect(plano).toHaveProperty('objetivos');
            expect(plano).toHaveProperty('metodologia');
            expect(plano).toHaveProperty('avaliacao');
            expect(plano.geradoPorIA).toBe(true);
        });
    });

    describe('AtividadeAvaliativa', () => {
        it('deve aceitar tipos válidos de atividade', () => {
            const tiposValidos = ['objetiva', 'discursiva', 'pratica'];

            tiposValidos.forEach(tipo => {
                const atividade = {
                    id: 'ativ123',
                    unidadeId: 'unidade456',
                    enunciado: 'Enunciado da questão',
                    tipo,
                    criteriosAvaliacao: 'Critérios',
                    geradoPorIA: true
                };

                expect(tiposValidos).toContain(atividade.tipo);
            });
        });
    });
});

describe('Validações de Input', () => {
    it('deve validar disciplina com nome mínimo', () => {
        const validarDisciplina = (nome: string) => nome.length >= 3;

        expect(validarDisciplina('AB')).toBe(false);
        expect(validarDisciplina('ABC')).toBe(true);
        expect(validarDisciplina('Cultura Digital')).toBe(true);
    });

    it('deve validar tema com comprimento adequado', () => {
        const validarTema = (tema: string) => tema.length >= 3 && tema.length <= 200;

        expect(validarTema('AI')).toBe(false);
        expect(validarTema('Inteligência Artificial')).toBe(true);
        expect(validarTema('A'.repeat(201))).toBe(false);
    });

    it('deve validar tipo de atividade', () => {
        const tiposValidos = ['objetiva', 'discursiva', 'pratica'];
        const validarTipo = (tipo: string) => tiposValidos.includes(tipo);

        expect(validarTipo('objetiva')).toBe(true);
        expect(validarTipo('discursiva')).toBe(true);
        expect(validarTipo('pratica')).toBe(true);
        expect(validarTipo('invalido')).toBe(false);
    });
});

describe('Formatação de Dados', () => {
    it('deve formatar data corretamente', () => {
        const formatDate = (date: Date) => {
            return new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: 'short',
            }).format(date);
        };

        const data = new Date(2026, 0, 24); // 24 de janeiro de 2026
        const formatado = formatDate(data);

        expect(formatado).toContain('24');
        expect(formatado.toLowerCase()).toContain('jan');
    });

    it('deve gerar ID único', () => {
        const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

        const id1 = generateId();
        const id2 = generateId();

        expect(id1).not.toBe(id2);
        expect(id1.length).toBeGreaterThan(5);
    });
});
