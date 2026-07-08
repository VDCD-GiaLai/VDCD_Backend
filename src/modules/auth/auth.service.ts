import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AdminUser } from '../admin-user/entities/admin-user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AdminUser)
    private userRepo: Repository<AdminUser>,
    private jwtService: JwtService,
    private config: ConfigService,
    private redisService: RedisService,
  ) {}

  private parseTimeToSeconds(timeStr: string): number {
    const value = parseInt(timeStr, 10);
    const unit = timeStr.slice(-1);
    switch (unit) {
      case 's':
        return value;
      case 'm':
        return value * 60;
      case 'h':
        return value * 60 * 60;
      case 'd':
        return value * 24 * 60 * 60;
      default:
        return value;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
      },
    });
    if (!user)
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    if (!user.isActive) throw new ForbiddenException('Tài khoản đã bị khoá');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

    const payload = { sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const refreshExpires =
      this.config.get<string>('JWT_REFRESH_EXPIRES_IN') ??
      this.config.get<string>('jwt.refreshExpiresIn') ??
      '7d';
    const refreshHash = await bcrypt.hash(refreshToken, 10);
    await this.redisService.set(
      `refresh_token:${user.id}`,
      refreshHash,
      this.parseTimeToSeconds(refreshExpires),
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.userRepo.findOne({ where: { id: payload.sub } });
      if (!user) throw new UnauthorizedException();

      const storedHash = await this.redisService.get(
        `refresh_token:${user.id}`,
      );
      if (!storedHash)
        throw new UnauthorizedException(
          'Phiên đăng nhập đã hết hạn hoặc không tồn tại',
        );

      const valid = await bcrypt.compare(refreshToken, storedHash);
      if (!valid) throw new UnauthorizedException('Refresh token không hợp lệ');

      const accessToken = this.jwtService.sign(
        { sub: user.id, role: user.role },
        {
          secret: this.config.get('JWT_SECRET'),
          expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
        },
      );

      return { accessToken };
    } catch {
      throw new UnauthorizedException(
        'Refresh token không hợp lệ hoặc đã hết hạn',
      );
    }
  }

  async logout(userId: string) {
    await this.redisService.del(`refresh_token:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async me(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
