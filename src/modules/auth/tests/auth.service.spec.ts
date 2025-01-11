import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { OtpEntity } from 'src/modules/user/entities/otp.entity';
import { TokenService } from '../token.service';
import { MockUserRepository } from './mock/user.repository.mock';
import { MockOtpRepository } from './mock/otp.repository.mock';
import { MockTokenService } from './mock/token.service.mock';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
	let service: AuthService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [AuthService,
				{
					provide: getRepositoryToken(UserEntity),
					useValue: MockUserRepository
				},
				{
					provide: getRepositoryToken(OtpEntity),
					useValue: MockOtpRepository
				},
				{
					provide: TokenService,
					useValue: MockTokenService
				}],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe("SendOtp Process", () => {
		it('Should create a new OTP code and return it', async function () {
			const phoneDto = { phone: "09111111111" };

			expect(await service.sendOtp(phoneDto)).toEqual({
				code: expect.any(String)
			})

			expect(MockUserRepository.findOneBy).toHaveBeenCalledWith(phoneDto);
			expect(MockUserRepository.create).toHaveBeenCalledWith(phoneDto);
			expect(MockUserRepository.save).toHaveBeenCalledWith(phoneDto);
			expect(MockUserRepository.update).toHaveBeenCalledWith({ id: 2 }, { otpId: 10 });
			expect(MockOtpRepository.findOneBy).toHaveBeenCalledWith({ userId: 2 });
			expect(MockOtpRepository.create).toHaveBeenCalled()
			expect(MockOtpRepository.save).toHaveBeenCalled();
		});
	})

	describe("CheckOtp Process", () => {
		it('Should validate OTP and create access token', async function () {
			const otpDto = { phone: "09111111111", code: "12345" };

			expect(await service.checkOtp(otpDto)).toEqual({
				message: "You have logged in successfully",
				accessToken: "JWT TOKEN",
			})

			expect(MockUserRepository.findOneBy).toHaveBeenCalledWith({ phone: otpDto.phone });
			expect(MockUserRepository.update).toHaveBeenCalledWith({ id: 2 }, { verify_phone: true });
			expect(MockOtpRepository.findOne).toHaveBeenCalledWith({ where: { userId: 2, code: otpDto.code } });
			expect(MockTokenService.createAccessToken).toHaveBeenCalledWith({ userId: 2 });
		});

		it('Should throw unauthorized error if otp was not found', async function () {
			const otpDto = { phone: "09111111111", code: "66666" };

			const methodResponse = service.checkOtp(otpDto)

			await expect(methodResponse).rejects.toThrow(UnauthorizedException);
			await expect(methodResponse).rejects.toThrow('Authorization failed, please retry');

			expect(MockUserRepository.findOneBy).toHaveBeenCalledWith({ phone: otpDto.phone });
			expect(MockOtpRepository.findOne).toHaveBeenCalledWith({ where: { userId: 2, code: otpDto.code } });
		});

		it('Should throw unauthorized error if otp is expired', async function () {
			const otpDto = { phone: "09111111111", code: "12345" };

			const methodResponse = service.checkOtp(otpDto)

			await expect(methodResponse).rejects.toThrow(UnauthorizedException);
			await expect(methodResponse).rejects.toThrow('OTP code expired');

			expect(MockUserRepository.findOneBy).toHaveBeenCalledWith({ phone: otpDto.phone });
			expect(MockOtpRepository.findOne).toHaveBeenCalledWith({ where: { userId: 2, code: otpDto.code } });
		});

		it('Should throw unauthorized error if otp is invalid', async function () {
			const otpDto = { phone: "09111111111", code: "56789" };

			const methodResponse = service.checkOtp(otpDto)

			await expect(methodResponse).rejects.toThrow(UnauthorizedException);
			await expect(methodResponse).rejects.toThrow('Invalid OTP code');

			expect(MockUserRepository.findOneBy).toHaveBeenCalledWith({ phone: otpDto.phone });
			expect(MockOtpRepository.findOne).toHaveBeenCalledWith({ where: { userId: 2, code: otpDto.code } });
		});
	})

	describe("Access Token Verification", () => {
		it('Should verify access token and return user\'s data', async function () {
			const token = "JWT Token"

			expect(await service.validateAccessToken(token)).toEqual({
				id: 2,
				phone: '09172222222',
			});

			expect(MockTokenService.verifyAccessToken).toHaveBeenCalledWith(token);
			expect(MockUserRepository.findOne).toHaveBeenCalledWith({
				where: { id: 2 }, relations: ["profile"],
			});
		});

		it('Should throw unauthorized error if user was not found', async function () {
			const token = "JWT Token"

			const methodResponse = service.validateAccessToken(token)

			await expect(methodResponse).rejects.toThrow(UnauthorizedException);
			await expect(methodResponse).rejects.toThrow('Authorization failed, please retry');
		});
	})
});
