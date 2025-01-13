import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from 'src/modules/auth/auth.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { MockUserRepository } from 'src/modules/auth/tests/mock/user.repository.mock';
import { OtpEntity } from 'src/modules/user/entities/otp.entity';
import { MockOtpRepository } from 'src/modules/auth/tests/mock/otp.repository.mock';
import { ResponseTransformerInterceptor } from 'src/common/interceptor/response-transformer.interceptor';
import { isJWT } from 'class-validator';
import { UnprocessableEntityPipe } from 'src/common/pipe/unprocessable-entity.pipe';
import { HttpExceptionFilter } from 'src/common/filters/exception.filter';

describe('AuthModule (e2e)', () => {
	let app: INestApplication;

	beforeAll(() => {
		process.env.ACCESS_TOKEN_SECRET = 'test_secret'; // Mock secret for testing
	});

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthModule],
		})
			.overrideProvider(getRepositoryToken(UserEntity))
			.useValue(MockUserRepository)
			.overrideProvider(getRepositoryToken(OtpEntity))
			.useValue(MockOtpRepository)
			.compile();

		app = moduleFixture.createNestApplication();
		// initialize custom response interceptor
		app.useGlobalInterceptors(new ResponseTransformerInterceptor());
		// initialize custom validation pipe
		app.useGlobalPipes(new UnprocessableEntityPipe());
		// initialize custom exception filter
		app.useGlobalFilters(new HttpExceptionFilter());
		await app.init();
	});

	describe("Send OTP", () => {
		it('/auth/send-otp (POST)', async function () {
			const testRequest = await request(app.getHttpServer())
				.post('/auth/send-otp')
				.send({
					phone: '09111111111',
				})
				.expect(201);

			const { body: response } = testRequest;
			expect(response).toHaveProperty('message');
			expect(response).toHaveProperty('success');
			expect(response.success).toBeTruthy();
			expect(response).toHaveProperty('data');
			expect(response.data).toHaveProperty('code');
		});

		it('/auth/send-otp (POST) => should fail on invalid phone', async function () {
			await request(app.getHttpServer())
				.post('/auth/send-otp')
				.send({
					phone: '091111111',
				})
				.expect(422);
		});

		it('/auth/send-otp (POST) => should fail Due to non-expired OTP', async function () {
			await request(app.getHttpServer())
				.post('/auth/send-otp')
				.send({
					phone: '09111111111',
				})
				.expect(400);
		});
	});

	describe("Check OTP", () => {
		it('/auth/check-otp (POST)', async function () {
			const testRequest = await request(app.getHttpServer())
				.post('/auth/check-otp')
				.send({
					phone: '09172222222',
					code: "12345"
				})
				.expect(201)

			const { body: response } = testRequest;
			expect(response).toHaveProperty('message')
			expect(response).toHaveProperty('success');
			expect(response.success).toBeTruthy()
			expect(response).toHaveProperty('data');
			expect(response.data).toHaveProperty('accessToken');
			expect(isJWT(response.data.accessToken)).toBeTruthy()
		});

		it('/auth/check-otp (POST) => should fail on invalid phone', async function () {
			await request(app.getHttpServer())
				.post('/auth/check-otp')
				.send({
					phone: '091111111',
					code: "12345"
				})
				.expect(422);
		});

		it('/auth/check-otp (POST) => should fail on invalid code', async function () {
			await request(app.getHttpServer())
				.post('/auth/check-otp')
				.send({
					phone: '09111111111',
					code: "1235"
				})
				.expect(422);
		});

		it('/auth/check-otp (POST) => should fail on undefined OTP', async function () {
			await request(app.getHttpServer())
				.post('/auth/check-otp')
				.send({
					phone: '09111111111',
					code: "12345"
				})
				.expect(401)
				.then(function (res) {
					expect(res.body.message).toEqual('Authorization failed, please retry');
				})
		});

		it('/auth/check-otp (POST) => should fail on expired OTP', async function () {
			await request(app.getHttpServer())
				.post('/auth/check-otp')
				.send({
					phone: '09111111111',
					code: "12345"
				})
				.expect(401)
				.then(function (res) {
					expect(res.body.message).toEqual('OTP code expired');
				})
		});

		it('/auth/check-otp (POST) => should fail on incorrect OTP', async function () {
			await request(app.getHttpServer())
				.post('/auth/check-otp')
				.send({
					phone: '09111111111',
					code: "12346"
				})
				.expect(401)
				.then(function (res) {
					expect(res.body.message).toEqual('Invalid OTP code');
				})
		});
	});
});
