import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/LoginUserDto';
import {
  RefreshResponse,
  SignInResponse,
  SignUpResponse,
  UserWithoutPassword,
} from './types/auth.types';
import { SignupUserDto } from './dto/SignupUserDto';
import { Cookies } from 'src/common/decorators/cookie.decorator';
import { AuthGuard } from './guards/auth.guard';
import { ResetPasswordDto } from './dto/ResetPasswordDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async login(
    @Body() loginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignInResponse> {
    const { accessToken, refreshToken, ...payload } =
      await this.authService.login(loginDto);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ...payload, accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signup')
  async signup(
    @Body() signupDto: SignupUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<SignUpResponse> {
    const { accessToken, refreshToken, ...payload } =
      await this.authService.signup(signupDto);

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { ...payload, accessToken };
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(
    @Request() req,
    @Res({ passthrough: true }) response: Response,
  ): Promise<string> {
    const user = req.user as UserWithoutPassword;
    await this.authService.logout(user.id);
    response.clearCookie('refreshToken');

    return 'Logged out successfully';
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh')
  async refresh(
    @Cookies('refreshToken') refreshToken,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshResponse> {
    const { refreshToken: newRefreshToken, accessToken } =
      await this.authService.refresh(refreshToken);

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return { accessToken };
  }

  @HttpCode(HttpStatus.OK)
  @Get('/verify')
  async verify(@Request() req): Promise<UserWithoutPassword> {
    const [type, token] = req.headers.authorization.split(' ') ?? [];
    if (!token) throw new UnauthorizedException('No access token provided');
    if (type !== 'Bearer')
      throw new UnauthorizedException('Invalid token type');
    const user = await this.authService.verify(token);
    return user;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/forgot-password')
  async forgotPassword(@Body() body: { email: string }): Promise<void> {
    return this.authService.forgotPassword(body.email);
  }

  @HttpCode(HttpStatus.OK)
  @Post('reset-password')
  async resetPassword(@Body() { token, newPassword }: ResetPasswordDto) {
    return this.authService.resetPassword(token, newPassword);
  }
}
