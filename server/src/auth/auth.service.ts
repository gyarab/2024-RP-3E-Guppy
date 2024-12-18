import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/LoginUserDto';
import { Tokens, UserWithTokens } from './types/auth.types';
import { TokenService } from '../modules/token/token.service';
import { UserService } from '../modules/user/user.service';
import { SignupUserDto } from './dto/SignupUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginUserDto): Promise<UserWithTokens> {
    const { email, password } = loginDto;

    if (!email || !password)
      throw new BadRequestException('Email and password are required.');

    const user = await this.userService.user({ email });
    if (!user) throw new BadRequestException('Invalid email or password.');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      throw new BadRequestException('Invalid email or password.');

    const { password: _, ...payload } = user;
    const tokens = await this.tokenService.generateTokens(payload);

    return { ...payload, ...tokens };
  }

  async signup(signupDto: SignupUserDto): Promise<UserWithTokens> {
    const { email, password, name } = signupDto;

    if (!email || !password || !name)
      throw new BadRequestException('Email, password, and name are required.');

    const candidate = await this.userService.user({ email });
    if (candidate) throw new ConflictException('Email already taken.');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      ...signupDto,
      password: hashedPassword,
    });

    const { password: _, ...payload } = user;
    const tokens = await this.tokenService.generateTokens(payload);

    return { ...payload, ...tokens };
  }

  async refresh(refreshToken: string): Promise<Tokens> {
    if (!refreshToken)
      throw new UnauthorizedException('Refresh token is required.');

    const payload = await this.tokenService.validateRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedException('Invalid refresh token.');

    const user = await this.userService.user({ email: payload.email });
    if (!user) throw new UnauthorizedException('Invalid refresh token.');

    const { password: _, ...userData } = user;

    return await this.tokenService.generateTokens(userData);
  }

  async logout(userId: number): Promise<void> {
    await this.userService.update({
      where: { id: userId },
      data: { tokenVersion: { increment: 1 } },
    });
  }

  async verify(accessToken: string): Promise<boolean> {
    if (!accessToken) return false;

    const payload = await this.tokenService.validateAccessToken(accessToken);
    return !!payload;
  }
}
