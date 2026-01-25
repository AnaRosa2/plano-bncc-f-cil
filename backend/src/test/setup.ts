import { vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Mock global sensors or other globals if needed
// For example, if you use process.env everywhere:
process.env.NODE_ENV = 'test';
process.env.GEMINI_API_KEY = 'test-key';

// Mock AI Gemini Service
vi.mock('../services/ai-gemini.service', () => ({
    gerarTextoComIA: vi.fn().mockResolvedValue(JSON.stringify({
        objetivo: "Mock Objetivo",
        metodologia: "Mock Metodologia",
        meta: "Mock Meta",
        atividade: "Mock Atividade",
        nome: "Mock Disciplina",
        descricao: "Mock Descrição",
        sugestoesUnidades: [{ tema: "Tema Mock", objetivo: "Objetivo Mock" }]
    }))
}));

