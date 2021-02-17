import AuthService from './AuthService';
import userService from '@services/domain/User/index';

export const authService = new AuthService(userService);
