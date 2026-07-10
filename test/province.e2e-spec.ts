import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from '../src/modules/province/entities/province.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';

describe('ProvinceController (e2e)', () => {
  let app: INestApplication<App>;
  let provinceRepo: Repository<Province>;
  let configService: ConfigService;
  let jwtService: JwtService;

  let superadminToken: string;
  let editorToken: string;
  let userToken: string;

  let seedProvince1: Province;
  let seedProvince2: Province;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Replicate global configs from main.ts
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();

    provinceRepo = app.get<Repository<Province>>(getRepositoryToken(Province));
    configService = app.get<ConfigService>(ConfigService);

    // Initialize custom JwtService with the app's secret for generating test tokens
    const jwtSecret = configService.getOrThrow<string>('JWT_SECRET');
    jwtService = new JwtService({ secret: jwtSecret });

    // Generate tokens for testing roles
    superadminToken = jwtService.sign({
      sub: '00000000-0000-0000-0000-000000000001',
      role: 'superadmin',
    });
    editorToken = jwtService.sign({
      sub: '00000000-0000-0000-0000-000000000002',
      role: 'editor',
    });
    userToken = jwtService.sign({
      sub: '00000000-0000-0000-0000-000000000003',
      role: 'user',
    });
  });

  beforeEach(async () => {
    // Clear any previous test seed data to prevent conflicts
    await provinceRepo.delete({ code: 'TEST_P1' });
    await provinceRepo.delete({ code: 'TEST_P2' });

    // Seed test provinces
    // 'Tỉnh A (Test)' has name starting with 'A' (should come before 'B')
    seedProvince1 = await provinceRepo.save(
      provinceRepo.create({
        name: 'Tỉnh A (Test)',
        code: 'TEST_P1',
        hasProject: true,
        centerCount: 2,
      }),
    );

    seedProvince2 = await provinceRepo.save(
      provinceRepo.create({
        name: 'Tỉnh B (Test)',
        code: 'TEST_P2',
        hasProject: false,
        centerCount: 0,
      }),
    );
  });

  afterEach(async () => {
    // Clean up test seed data after each test
    if (seedProvince1?.id) await provinceRepo.delete(seedProvince1.id);
    if (seedProvince2?.id) await provinceRepo.delete(seedProvince2.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/v1/provinces (Get all provinces)', () => {
    it('TC-01: Lấy danh sách thành công (Public)', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/provinces')
        .expect(200);

      expect(res.body.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(2);

      // Verify that results are sorted alphabetically by name
      const names: string[] = res.body.data.map((p: any) => p.name);
      const sortedNames = [...names].sort((a, b) => a.localeCompare(b));
      expect(names).toEqual(sortedNames);

      // Verify seed provinces exist in the list
      const p1 = res.body.data.find((p: any) => p.code === 'TEST_P1');
      const p2 = res.body.data.find((p: any) => p.code === 'TEST_P2');
      expect(p1).toBeDefined();
      expect(p2).toBeDefined();
    });

    it('TC-02: Xác thực cấu trúc dữ liệu trả về', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/provinces')
        .expect(200);

      const p1 = res.body.data.find((p: any) => p.code === 'TEST_P1');
      expect(p1).toEqual({
        id: seedProvince1.id,
        name: 'Tỉnh A (Test)',
        code: 'TEST_P1',
        hasProject: true,
        centerCount: 2,
      });
    });
  });

  describe('GET /api/v1/provinces/:code (Get province by code)', () => {
    it('TC-03: Lấy chi tiết thành công với code hợp lệ', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/provinces/TEST_P1')
        .expect(200);

      expect(res.body.statusCode).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.data.code).toBe('TEST_P1');
      expect(res.body.data.name).toBe('Tỉnh A (Test)');
      expect(res.body.data.id).toBe(seedProvince1.id);
    });

    it('TC-04: Lấy chi tiết thất bại do mã code không tồn tại', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/v1/provinces/XYZ')
        .expect(404);

      expect(res.body.statusCode).toBe(404);
      expect(res.body.message).toBe("Không tìm thấy tỉnh 'XYZ'");
    });
  });

  describe('PATCH /api/v1/provinces/:id (Update province details)', () => {
    it('TC-05: Cập nhật thành công bởi superadmin', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/provinces/${seedProvince2.id}`)
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          hasProject: true,
          centerCount: 5,
        })
        .expect(200);

      expect(res.body.statusCode).toBe(200);
      expect(res.body.data.hasProject).toBe(true);
      expect(res.body.data.centerCount).toBe(5);

      // Verify db changes
      const dbProvince = await provinceRepo.findOneBy({ id: seedProvince2.id });
      expect(dbProvince?.hasProject).toBe(true);
      expect(dbProvince?.centerCount).toBe(5);
    });

    it('TC-06: Cập nhật thành công bởi editor', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/provinces/${seedProvince1.id}`)
        .set('Authorization', `Bearer ${editorToken}`)
        .send({
          hasProject: false,
          centerCount: 0,
        })
        .expect(200);

      expect(res.body.statusCode).toBe(200);
      expect(res.body.data.hasProject).toBe(false);
      expect(res.body.data.centerCount).toBe(0);

      // Verify db changes
      const dbProvince = await provinceRepo.findOneBy({ id: seedProvince1.id });
      expect(dbProvince?.hasProject).toBe(false);
      expect(dbProvince?.centerCount).toBe(0);
    });

    it('TC-07: Cập nhật thất bại do thiếu Token', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/provinces/${seedProvince2.id}`)
        .send({
          hasProject: true,
          centerCount: 1,
        })
        .expect(401);

      expect(res.body.statusCode).toBe(401);
      expect(res.body.message).toBe('Unauthorized');
    });

    it('TC-08: Cập nhật thất bại do sai quyền (Role không hợp lệ)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/provinces/${seedProvince2.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          hasProject: true,
          centerCount: 1,
        })
        .expect(403);

      expect(res.body.statusCode).toBe(403);
      expect(res.body.message).toBe('Forbidden resource');
    });

    it('TC-09: Cập nhật thất bại do ID tỉnh không tồn tại', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/provinces/${nonExistentId}`)
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          hasProject: true,
          centerCount: 1,
        })
        .expect(404);

      expect(res.body.statusCode).toBe(404);
    });

    it('TC-10: Cập nhật thất bại do dữ liệu body không hợp lệ (Validation)', async () => {
      const res = await request(app.getHttpServer())
        .patch(`/api/v1/provinces/${seedProvince2.id}`)
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          hasProject: 'not_a_boolean',
          centerCount: -3,
        })
        .expect(400);

      expect(res.body.statusCode).toBe(400);
      expect(Array.isArray(res.body.message)).toBe(true);
      expect(res.body.message.some((msg: string) => msg.includes('hasProject'))).toBe(true);
      expect(res.body.message.some((msg: string) => msg.includes('centerCount'))).toBe(true);
    });
  });
});
