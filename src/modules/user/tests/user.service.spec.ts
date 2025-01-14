import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../user.service';
import { REQUEST } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { ProfileEntity } from '../entities/profile.entity';
import { OtpEntity } from '../entities/otp.entity';
import { AuthService } from 'src/modules/auth/auth.service';
import { MockProfileRepository_UserModule as MockProfileRepository } from './mock/profile.repository.mock';
import { MockUserRepository_AuthModule as MockUserRepository } from 'src/modules/auth/tests/mock/user.repository.mock';
import { MockOtpRepository_AuthModule as MockOtpRepository } from 'src/modules/auth/tests/mock/otp.repository.mock';
import { MockRequest_UserModule as MockRequest } from './mock/request.mock';
import { MockAuthService_UserModule as MockAuthService } from './mock/auth.service.mock';

describe('UserService', () => {
	let service: UserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UserService,
				{
					provide: getRepositoryToken(UserEntity),
					useValue: MockUserRepository,
				},
				{
					provide: getRepositoryToken(ProfileEntity),
					useValue: MockProfileRepository,
				},
				{
					provide: getRepositoryToken(OtpEntity),
					useValue: MockOtpRepository,
				},
				{
					provide: REQUEST,
					useValue: MockRequest,
				},
				{
					provide: AuthService,
					useValue: MockAuthService
				},
			],
		}).compile();

		// Due to the usage of the `scope: Scope.REQUEST` in the service
		// you have to use resolve() instead of get()
		service = await module.resolve<UserService>(UserService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe("Change Profile", () => {
		it('Should update profile', async function () {
			const profileDto = {
				fullname: "Saeed Norouzi",
				nickname: "Developer",
				bio: "this is my profile bio",
				gender: 'male',
				birthday: new Date(),
				linkedin_profile: "Linkedin"
			}

			expect(await service.changeProfile(profileDto)).toEqual("Profile updated successfully")

			expect(MockProfileRepository.findOneBy).toHaveBeenCalledWith({ userId: MockRequest.user.id });
			expect(MockProfileRepository.save).toHaveBeenCalledWith({
				id: 1,
				email: 'example@example.com',
				new_email: null,
				verify_email: true,
				userId: 2,
				...profileDto
			});
		});

		it('Should create profile', async function () {
			const profileDto = {
				fullname: "Saeed Norouzi",
				nickname: "Developer",
				bio: "this is my profile bio",
				gender: 'male',
				birthday: new Date(),
				linkedin_profile: "Linkedin"
			}

			expect(await service.changeProfile(profileDto)).toEqual("Profile updated successfully")

			expect(MockProfileRepository.findOneBy).toHaveBeenCalledWith({ userId: MockRequest.user.id });
			expect(MockProfileRepository.create).toHaveBeenCalledWith({ ...profileDto, userId: MockRequest.user.id });
			expect(MockProfileRepository.save).toHaveBeenCalledWith({
				userId: 2,
				...profileDto
			});
		});
	});
})
