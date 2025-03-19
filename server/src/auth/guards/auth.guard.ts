import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenService } from '../../modules/token/token.service';
import { UserService } from 'src/modules/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) throw new UnauthorizedException('No access token provided');

    const payload = await this.tokenService.validateAccessToken(token);

    const user = await this.userService.user({ id: payload.id });

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedException('Invalid access token');
    }

    request['user'] = payload;
    return true;
  }

  private extractTokenFromRequest(request: Request): string | undefined {
    if (request.cookies && request.cookies.accessToken) {
      return request.cookies.accessToken;
    }
    
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
