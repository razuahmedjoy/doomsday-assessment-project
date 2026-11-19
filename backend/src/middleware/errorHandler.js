import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { HttpError } from '../utils/HttpError.js';

// Every error response has the same shape: { success: false, code, message }.
const send = (res, status, code, message) => res.status(status).json({ success: false, code, message });

export function notFound(req, res) {
  send(res, 404, 'NOT_FOUND', 'Route not found');
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) return send(res, err.status, err.code, err.message);

  if (err instanceof ZodError) {
    const message = err.issues
      .map((issue) => (issue.path.length ? `${issue.path.join('.')}: ${issue.message}` : issue.message))
      .join('; ');
    return send(res, 400, 'VALIDATION_ERROR', message);
  }

  if (err.type === 'entity.parse.failed') return send(res, 400, 'VALIDATION_ERROR', 'Invalid JSON body');

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') return send(res, 409, 'DUPLICATE', `${err.meta?.target ?? 'Value'} already exists`);
    if (err.code === 'P2034') return send(res, 409, 'CONFLICT', 'Another update happened at the same time, please retry');
  }

  console.error(err);
  send(res, 500, 'INTERNAL_ERROR', 'Something went wrong');
}
