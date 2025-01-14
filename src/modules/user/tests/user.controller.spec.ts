import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { AuthService } from '../../auth/auth.service';
import { objectSanitizer } from 'src/common/utils/object-sanitizer.utility';
import { MockUserService_UserModule as MockUserService } from './mock/user.service.mock';

describe('UserController', () => {
	let controller: UserController;

	const MockAuthService = {
		// Mock methods used by AuthGuard or AuthService here
	};

	const MockAuthGuard = {
		canActivate: jest.fn(() => true), // Mock `canActivate` to always return true
	}

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UserController],
			providers: [
				{
					provide: UserService,
					useValue: MockUserService,
				},
				{
					provide: AuthService,
					useValue: MockAuthService,
				},
				{
					provide: 'AuthGuard',
					useValue: MockAuthGuard
				},
			],
		}).compile();

		controller = module.get<UserController>(UserController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('Should update user\'s profile', async function () {
		const profileDto = {
			fullname: "Saeed Norouzi",
			nickname: "tester",
			bio: "this is my profile bio",
			gender: 'male',
			birthday: new Date(),
			linkedin_profile: "Linkedin"
		}

		expect(controller.changeProfile(profileDto)).toEqual("Profile updated successfully")


		/** Remove invalid data */
		objectSanitizer(profileDto);
		expect(MockUserService.changeProfile).toHaveBeenCalledWith(profileDto)
	});

	it('Should retrieve profile', async function () {
		expect(controller.grtProfile()).toEqual({
			fullname: "Saeed Norouzi",
			nickname: "tester",
			bio: "this is my profile bio",
			gender: 'male',
			birthday: new Date(),
			linkedin_profile: "Linkedin"
		})
	});

	it('Should send email OTP', async function () {
		const emailDto = { email: "example@test.com" }

		expect(controller.changeEmail(emailDto)).toEqual({
			message: "OTP has been sent to your email address",
			code: expect.any(String)
		})

		expect(MockUserService.changeEmail).toHaveBeenCalledWith(emailDto.email)
	});

	it('Should verify email address', async function () {
		const emailOtpDto = { email: "example@test.com", code: "12345" }

		expect(controller.verifyEmail(emailOtpDto)).toEqual("Email address updated successfully")

		expect(MockUserService.verifyEmail).toHaveBeenCalledWith(emailOtpDto)
	});

	it('Should send phone OTP', async function () {
		const phoneDto = { phone: "09171111111" }

		expect(controller.changePhone(phoneDto)).toEqual({
			message: "OTP has been sent to your phone number",
			code: expect.any(String)
		})

		expect(MockUserService.changePhone).toHaveBeenCalledWith(phoneDto.phone)
	});

	it('Should verify phone number', async function () {
		const phoneDto = { phone: "09171111111", code: "12345" }

		expect(controller.verifyPhone(phoneDto)).toEqual("Phone number updated successfully")

		expect(MockUserService.verifyPhone).toHaveBeenCalledWith(phoneDto)
	});
});
