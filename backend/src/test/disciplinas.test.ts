import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('Integração: Rotas de Disciplinas', () => {
    it('POST /disciplinas/gerar deve retornar uma disciplina gerada', async () => {
        const response = await request(app)
            .post('/disciplinas/gerar')
            .send({ anoSerie: '6º ano', tema: 'Cultura Digital' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nome');
    });

    it('GET /rota-inexistente deve retornar 404', async () => {
        const response = await request(app).get('/rota-inexistente');
        expect(response.status).toBe(404);
        expect(response.body.error.code).toBe('NOT_FOUND');
    });
});
