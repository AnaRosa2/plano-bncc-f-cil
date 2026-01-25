import { describe, it, expect } from 'vitest';

describe('Exemplo de Teste', () => {
    it('deve realizar uma soma simples', () => {
        expect(1 + 1).toBe(2);
    });

    it('deve verificar variáveis de ambiente de teste', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
});
