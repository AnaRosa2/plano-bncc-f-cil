import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../server';

// Mock do serviço de IA (se houver um serviço separado, seria melhor mockar o serviço)
// Como está tudo nas rotas/controllers, vamos testar a integração real ou mockar a API externa se necessário.

describe('Integração: Rotas de Unidades', () => {
    it('POST /unidades deve retornar erro 400 se faltar dados', async () => {
        const response = await request(app)
            .post('/unidades')
            .send({ disciplina: 'Matemática' }); // Falta tema

        expect(response.status).toBe(400);
    });

    it('POST /unidades/sugerir-tema deve retornar sugestões', async () => {
        // Nota: Esta rota provavelmente chama uma IA. 
        // Em um cenário real, deveríamos mockar o cliente da IA.
        const response = await request(app)
            .post('/unidades/sugerir-tema')
            .send({ disciplina: 'História', quantidade: 2 });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
