// backend/src/validators/schemas.ts
import { Request, Response, NextFunction } from 'express';
import { createError } from '../middlewares/errorHandler';

/**
 * Validar requisição de plano de aula
 */
export function validatePlanoAula(req: Request, res: Response, next: NextFunction) {
    const { disciplina, tema } = req.body;

    if (!disciplina || typeof disciplina !== 'string') {
        return next(createError('Campo "disciplina" é obrigatório e deve ser texto', 400, 'VALIDATION_ERROR'));
    }

    if (!tema || typeof tema !== 'string') {
        return next(createError('Campo "tema" é obrigatório e deve ser texto', 400, 'VALIDATION_ERROR'));
    }

    if (disciplina.length < 3 || disciplina.length > 100) {
        return next(createError('Disciplina deve ter entre 3 e 100 caracteres', 400, 'VALIDATION_ERROR'));
    }

    if (tema.length < 3 || tema.length > 200) {
        return next(createError('Tema deve ter entre 3 e 200 caracteres', 400, 'VALIDATION_ERROR'));
    }

    next();
}

/**
 * Validar requisição de atividade
 */
export function validateAtividade(req: Request, res: Response, NextFunction) {
    const { tema, tipo } = req.body;

    if (!tema || typeof tema !== 'string') {
        return next(createError('Campo "tema" é obrigatório e deve ser texto', 400, 'VALIDATION_ERROR'));
    }

    if (!tipo || typeof tipo !== 'string') {
        return next(createError('Campo "tipo" é obrigatório e deve ser texto', 400, 'VALIDATION_ERROR'));
    }

    const tiposValidos = ['objetiva', 'discursiva', 'pratica'];
    if (!tiposValidos.includes(tipo)) {
        return next(createError(`Tipo deve ser um dos seguintes: ${tiposValidos.join(', ')}`, 400, 'VALIDATION_ERROR'));
    }

    if (tema.length < 3 || tema.length > 200) {
        return next(createError('Tema deve ter entre 3 e 200 caracteres', 400, 'VALIDATION_ERROR'));
    }

    next();
}

/**
 * Validar requisição de sugestão de unidades
 */
export function validateSugestaoUnidades(req: Request, res: Response, next: NextFunction) {
    const { disciplina } = req.body;

    if (!disciplina || typeof disciplina !== 'string') {
        return next(createError('Campo "disciplina" é obrigatório e deve ser texto', 400, 'VALIDATION_ERROR'));
    }

    if (disciplina.length < 3 || disciplina.length > 100) {
        return next(createError('Disciplina deve ter entre 3 e 100 caracteres', 400, 'VALIDATION_ERROR'));
    }

    next();
}
