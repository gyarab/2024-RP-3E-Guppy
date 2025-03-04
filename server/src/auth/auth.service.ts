import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/LoginUserDto';
import {
  Tokens,
  UserWithoutPassword,
  UserWithTokens,
} from './types/auth.types';
import { TokenService } from '../modules/token/token.service';
import { UserService } from '../modules/user/user.service';
import { MailService } from '../modules/mail/mail.service';
import { SignupUserDto } from './dto/SignupUserDto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
    private readonly mailService: MailService
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

    await this.mailService.sendMail(user.email, 'signup', { name: user.name });

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

  async verify(accessToken: string): Promise<UserWithoutPassword> {
    if (!accessToken) {
      return null;
    }

    const payload = await this.tokenService.validateAccessToken(accessToken);
    return payload;
  }

  async forgotPassword(email: string): Promise<void> {
    if (!email) throw new BadRequestException('Email is required.');

    const user = await this.userService.user({ email });
    if (!user) throw new BadRequestException('User not found.');

    const token = await bcrypt.hash(user.email, 10);
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}`;

    await this.userService.update({
      where: { email },
      data: {
        resetPasswordToken: token,
        resetPasswordTokenExpiry: new Date(Date.now() + 3600000),
      },
    });

    await this.mailService.sendMail(user.email, 'forgot-password', {
      name: user.name,
      resetLink,
    });
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token || !newPassword)
      throw new BadRequestException('Token and new password are required.');
  
    const user = await this.userService.findFirst({
      where: { resetPasswordToken: token },
    });

    console.log(user);
  
    if (!user || !user.resetPasswordToken || !user.resetPasswordTokenExpiry) {
      throw new BadRequestException('Invalid or expired token.');
    }

    const isTokenValid = (token === user.resetPasswordToken);
  
    if (!isTokenValid || user.resetPasswordTokenExpiry < new Date())
      throw new BadRequestException('Invalid or expired token.');
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    await this.userService.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordTokenExpiry: null,
      },
    });
  }
  
  
}
