import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from '../token.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('TokenService', () => {
	let service: TokenService;
	let jwtService: JwtService;

	const mockSecret = 'test_secret'; // Mock secret for testing

	beforeAll(() => {
		process.env.ACCESS_TOKEN_SECRET = mockSecret;
	});

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TokenService, JwtService],
		}).compile();

		service = module.get<TokenService>(TokenService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('Should create JWT access toke', async function () {
		const payload = { userId: 2 };

		const token = service.createAccessToken(payload);
		expect(typeof token).toBe('string');

		const decoded = jwtService.verify(token, { secret: mockSecret });
		expect(decoded).toBeDefined();
		expect(decoded.userId).toBe(payload.userId);
	});

	it('Should verify the access token', async function () {
		const payload = { userId: 2 };

		const token = service.createAccessToken(payload);

		const decoded = service.verifyAccessToken(token)
		expect(decoded).toBeDefined();
		expect(decoded.userId).toBe(payload.userId);
	});

	it('Should throw unauthorized error if token is invalid', async function () {
		const payload = { userId: 2 };

		const token = service.createAccessToken(payload);

		try {
			service.verifyAccessToken(token + "-invalidator")
		} catch (error) {
			expect(error).toBeInstanceOf(UnauthorizedException)
			expect(error.message).toBe("Authorization failed, please retry")
		}
	});
});
