import { isDBConnected } from '../config/db.js';
import { env } from '../config/env.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class HealthController {
  static getHealth = asyncHandler(async (req, res) => {
    const dbConnected = isDBConnected();

    const data = {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      environment: env.NODE_ENV,
      services: {
        database: {
          type: 'MongoDB',
          status: dbConnected ? 'connected' : 'disconnected',
        },
      },
    };

    const statusCode = dbConnected ? 200 : 503;

    return res.status(statusCode).json(
      ApiResponse.success(
        data,
        dbConnected ? 'Verdict Beach API is running smoothly' : 'Database connection unavailable',
        statusCode
      )
    );
  });
}
