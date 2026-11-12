import { ApiError } from '../utils/apiError.js';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      // Assign back parsed data (which has trims, transforms, and type coercions)
      if (parsed.body) req.body = parsed.body;
      if (parsed.query) req.query = parsed.query;
      if (parsed.params) req.params = parsed.params;

      next();
    } catch (err) {
      if (err.errors) {
        const formattedErrors = err.errors.map((e) => ({
          field: e.path.filter((p) => p !== 'body' && p !== 'query' && p !== 'params').join('.'),
          message: e.message,
        }));
        return next(ApiError.badRequest('Validation failed', formattedErrors));
      }
      next(err);
    }
  };
}
