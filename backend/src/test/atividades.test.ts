import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Integração: Rotas de Atividades', () => {
    it('POST /atividades/gerar deve retornar erro 400 se faltar tema', async () => {
        const response = await request(app)
            .post('/atividades/gerar')
            .send({ tipo: 'discursiva' });

        expect(response.status).toBe(400);
    });

    it('POST /atividades/gerar deve retornar 200 com dados válidos', async () => {
        const response = await request(app)
            .post('/atividades/gerar')
            .send({ tema: 'IA', tipo: 'discursiva', anoSerie: '9º ano' });

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
    });
});
