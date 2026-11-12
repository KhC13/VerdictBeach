import { AuthService } from '../services/auth.service.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AuthController {
  /**
   * Register a new admin/staff user
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const result = await AuthService.register(req.body);

    return res
      .status(201)
      .json(ApiResponse.created(result, 'Account registered successfully.'));
  });

  /**
   * Login user and issue JWT
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const result = await AuthService.login(req.body);

    return res
      .status(200)
      .json(ApiResponse.success(result, 'Logged in successfully.'));
  });

  /**
   * Get current authenticated user profile
   * GET /api/auth/me
   */
  static getMe = asyncHandler(async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user.id);

    return res
      .status(200)
      .json(ApiResponse.success(user, 'User profile retrieved successfully.'));
  });
}
