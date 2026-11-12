import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';

export class AuthService {
  /**
   * Register a new admin/counsel user
   */
  static async register({ name, email, password, role = 'admin' }) {
    const existing = await User.findOne({ email });
    if (existing) {
      throw ApiError.conflict('An account with this email already exists.');
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    const token = user.generateAuthToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Login an existing user
   */
  static async login({ email, password }) {
    // Explicitly select password field since it is select: false
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Your account has been deactivated. Please contact an administrator.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = user.generateAuthToken();

    return {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  /**
   * Get user profile by ID
   */
  static async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }
}
