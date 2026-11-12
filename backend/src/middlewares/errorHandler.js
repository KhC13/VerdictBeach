import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';

export function errorHandler(err, req, res, next) {
  let error = err;

  // Handle Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = ApiError.badRequest(message);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0];
    const message = `Duplicate value entered for ${field}. Please use another value.`;
    error = ApiError.conflict(message);
  }

  // Handle Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    error = ApiError.badRequest('Database validation error', errors);
  }

  // If error is not an instance of ApiError, default to 500 internal error
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  const errors = error.errors || [];

  const response = {
    success: false,
    statusCode,
    message,
    ...(errors.length > 0 && { errors }),
    ...(env.isDevelopment && { stack: err.stack }),
  };

  res.status(statusCode).json(response);
}
