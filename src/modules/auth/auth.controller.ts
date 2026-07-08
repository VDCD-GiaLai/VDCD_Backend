import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiProperty,
} from '@nestjs/swagger';

class LoginDto {
  @ApiProperty({
    example: 'admin@vdcd.vn',
    description: 'User login email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User login password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

class UserResponseDto {
  @ApiProperty({
    example: 'd3b07384-d113-4956-a5db-e78119d90184',
    description: 'Account ID',
  })
  id: string;

  @ApiProperty({ example: 'admin_user', description: 'Username' })
  username: string;

  @ApiProperty({ example: 'admin@vdcd.vn', description: 'Email address' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'Account role' })
  role: string;
}

class LoginResponseDto {
  @ApiProperty({
    type: UserResponseDto,
    description: 'Authenticated user information',
  })
  user: UserResponseDto;
}

class MeResponseDto extends UserResponseDto {
  @ApiProperty({
    example: true,
    description: 'Active status of the user account',
  })
  isActive: boolean;
}

class RefreshResponseDto {
  @ApiProperty({
    example: true,
    description: 'Indicates token refresh success status',
  })
  success: boolean;
}

class LogoutResponseDto {
  @ApiProperty({
    example: 'Logged out successfully',
    description: 'Logout result message',
  })
  message: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private getCookieMaxAge(timeStr: string): number {
    const value = parseInt(timeStr, 10);
    const unit = timeStr.slice(-1);
    switch (unit) {
      case 's':
        return value * 1000;
      case 'm':
        return value * 60 * 1000;
      case 'h':
        return value * 60 * 60 * 1000;
      case 'd':
        return value * 24 * 60 * 60 * 1000;
      default:
        return value;
    }
  }

  @Public()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('login')
  @ApiOperation({
    summary: 'Login to system',
    description:
      'Authenticate credentials, set accessToken and refreshToken into HttpOnly cookies.',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Successfully authenticated. Tokens are set in cookies.',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid email or password.' })
  @ApiResponse({ status: 403, description: 'Account is currently locked.' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const { accessToken, refreshToken, user } = await this.authService.login(
      dto.email,
      dto.password,
    );

    const accessExpires =
      this.configService.get<string>('JWT_EXPIRES_IN') ??
      this.configService.get<string>('jwt.expiresIn') ??
      '15m';
    const refreshExpires =
      this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') ??
      this.configService.get<string>('jwt.refreshExpiresIn') ??
      '7d';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.getCookieMaxAge(accessExpires),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.getCookieMaxAge(refreshExpires),
    });

    return { accessToken, refreshToken, user };
  }

  @Public()
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Access Token',
    description:
      'Extract refreshToken from cookies and automatically set a new accessToken in cookies.',
  })
  @ApiResponse({
    status: 201,
    description: 'Access token refreshed successfully.',
    type: RefreshResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token is missing, invalid, or expired.',
  })
  async refresh(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found in cookies');
    }

    const { accessToken } = await this.authService.refresh(refreshToken);

    const accessExpires =
      this.configService.get<string>('JWT_EXPIRES_IN') ??
      this.configService.get<string>('jwt.expiresIn') ??
      '15m';

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: this.getCookieMaxAge(accessExpires),
    });

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({
    summary: 'Logout from system',
    description:
      'Revoke the session in Redis and clear both access and refresh cookies.',
  })
  @ApiResponse({
    status: 201,
    description: 'Successfully logged out.',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized (Access Token missing or expired).',
  })
  async logout(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const user = (req as any).user;
    await this.authService.logout(user.id);

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({
    summary: 'Get current user profile',
    description:
      'Read accessToken from cookies to return current user account details.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved profile information.',
    type: MeResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  me(@Req() req: express.Request) {
    const user = (req as any).user;
    return this.authService.me(user.id);
  }
}
