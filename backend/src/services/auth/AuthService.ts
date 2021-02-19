import UserModel from '@models/User.model';
import { IUserService } from '@services/domain/User';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import config from '@config/index';

interface IRegisterBody {
  login: string;
  password: string;
}

interface ILoginBody {
  login: string;
  password: string;
}

export default class AuthService {
  constructor (private userService: IUserService) {}

  async register(body: IRegisterBody) {

    if (!body.login || !body.password) throw new Error('Неверные данные');

    const findUser = await this.userService.findOne({ where: { email: body.login } });

    if (findUser) throw new Error('Пользователь с данным email уже существует');

    const password = this.generatePassword(body.password);

    const createdUser = await this.userService.create({ password, login: body.login });

    return createdUser;

  }

  async login(body: ILoginBody) {
    if (!body.login || !body.password) throw new Error('Неверные данные');

    const findUser = await this.userService.findOne({ where: { login: body.login } });

    if (!findUser) throw new Error('Пользователь с данным email не существует');

    if (!this.verifyPassword(findUser.password, body.password)) throw new Error('Введен не верный пароль');

    delete findUser.password;

    return { user: findUser, ...this.generateJWT(findUser) };
  }

  async refreshToken(refreshToken: string) {
    const refreshTokenVerify = this.verifyRefreshJWT(refreshToken);

    if (!refreshTokenVerify) throw new Error('Refresh token not valid');

    const findUser = await this.userService.findOne({ where: { id: refreshTokenVerify.id } });

    return this.generateJWT(findUser);
  }

  generateJWT(payload: UserModel) {
    if (!payload) return false;

    const accessToken = sign(payload.toJSON(), config.app.auth.accessTokenSecret, {
      algorithm: 'HS256',
      expiresIn: config.app.auth.accessTokenLife,
    });

    const refreshToken = sign(payload.toJSON(), config.app.auth.refreshTokenSecret, {
      algorithm: 'HS256',
      expiresIn: config.app.auth.refreshTokenLife,
    });

    return { accessToken, refreshToken };
  }

  verifyAccessJWT(token: string) {
    console.log('token', token);
    return verify(token, config.app.auth.accessTokenSecret) as UserModel;
  }

  verifyRefreshJWT(token: string) {
    return verify(token, config.app.auth.refreshTokenSecret) as UserModel;
  }

  generatePassword(password: string) {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  }

  verifyPassword(hashedPassword:string, inputPassword: string) {
    return compareSync(inputPassword, hashedPassword);
  }
}
