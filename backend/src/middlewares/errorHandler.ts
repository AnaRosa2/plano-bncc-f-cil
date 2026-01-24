// backend/src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

/**
 * Middleware centralizado de tratamento de erros
 * Garante respostas consistentes e informativas
 */
export function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Erro interno do servidor';

    // Log do erro para debugging
    console.error(`[ERROR] ${statusCode} - ${message}`);
    console.error('Stack:', err.stack);
    console.error('Request:', {
        method: req.method,
        path: req.path,
        body: req.body,
    });

    // Resposta estruturada para o frontend
    res.status(statusCode).json({
        error: {
            message,
            code: err.code || 'INTERNAL_ERROR',
            statusCode,
            path: req.path,
            timestamp: new Date().toISOString(),
        },
    });
}

/**
 * Middleware para capturar erros assíncronos
 */
export function asyncHandler(fn: Function) {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}

/**
 * Criar erro customizado com código e status
 */
export function createError(message: string, statusCode: number = 500, code?: string): AppError {
    const error = new Error(message) as AppError;
    error.statusCode = statusCode;
    error.code = code;
    return error;
}
