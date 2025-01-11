import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { MockAuthService } from './mock/auth.service.mock';

describe('AuthController', () => {
	let controller: AuthController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				{
					provide: AuthService,
					useValue: MockAuthService
				}
			],
		}).compile();

		controller = module.get<AuthController>(AuthController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('Should send OTP code', async function () {
		const phoneDto = { phone: "09111111111" }

		expect(controller.sendOtp(phoneDto)).toEqual({
			code: "32313"
		})

		expect(MockAuthService.sendOtp).toHaveBeenCalledWith(phoneDto)
	});

	it('Should validate the OTP and create a token', async function () {
		const otpDto = { phone: "09111111111", code: "12345" }

		expect(controller.checkOtp(otpDto)).toEqual({
			message: "You have logged in successfully",
			accessToken: "JWT Token"
		})

		expect(MockAuthService.checkOtp).toHaveBeenCalledWith(otpDto)
	});
});
