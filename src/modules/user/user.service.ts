import { BadRequestException, ConflictException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProfileEntity } from './entities/profile.entity';
import { OtpEntity } from './entities/otp.entity';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { AuthService } from '../auth/auth.service';
import { ProfileDto } from './dto/profile.dto';
import { isDate } from 'class-validator';
import { Gender } from './enums/gender.enum';
import { AuthMethod } from '../auth/enums/method.enum';
import { verifyEmailDto } from './dto/change-email.dto';
import { CheckOtpDto } from '../auth/dto/check-otp.dto';

@Injectable({ scope: Scope.REQUEST })
export class UserService {
	constructor(
		// Register user repository
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,
		// Register profile repository
		@InjectRepository(ProfileEntity)
		private profileRepository: Repository<ProfileEntity>,
		// Register otp repository
		@InjectRepository(OtpEntity)
		private otpRepository: Repository<OtpEntity>,
		// Register current request
		@Inject(REQUEST) private request: Request,
		// Register auth service
		private authService: AuthService,
	) { }

	/**
	 * Service of the process of updating user profile information
	 * @param {ProfileDto} profileDto - Profile data sent by user to be updated
	 */
	async changeProfile(profileDto: ProfileDto) {
		// Extract user's data from request
		const { id: userId, profileId } = this.request.user;

		// Retrieve user's profile data from database
		let profile = await this.profileRepository.findOneBy({ userId });

		// Extract birthday and gender from data sent by user
		const { birthday, gender } = profileDto;

		// Update profile data if profile exists or create a profile if it doesn't
		if (profile) {
			// Merge profileDto fields into the existing profile object
			Object.assign(profile, {
				...profileDto,
				// Set birthday if valid date
				birthday:
					birthday && isDate(new Date(birthday))
						? new Date(birthday)
						: profile.birthday,
				// Set gender if it matches allowed values
				gender:
					gender && Object.values(Gender as any).includes(gender)
						? gender
						: profile.gender,
			});
		} else {
			profile = this.profileRepository.create({ ...profileDto, userId });
		}

		// Save data into database
		profile = await this.profileRepository.save(profile);

		// add profile id to user's data
		if (!profileId) {
			await this.userRepository.update(
				{ id: userId },
				{ profileId: profile.id }
			);
		}

		return "Profile updated successfully"
	}

	/**
	 * Service of the process of retrieving user's profile data
	 */
	async getProfile() {
		// extract user's profile from request
		const { profile } = this.request.user;

		// return user's profile data
		return profile;
	}

	/**
	 * Service of the process of updating user's email address
	 * @param {string} email - user's new email address
	 */
	async changeEmail(email: string) {
		// extract user's id from request
		const { id } = this.request.user;

		// Retrieve profile data by email
		const profile: ProfileEntity = await this.profileRepository.findOneBy({ email });

		if (profile && id !== profile.userId) {
			// Throw error if the email is duplicated and don't belong to the user
			throw new ConflictException("Duplicated email address");
		} else if (profile && id === profile.userId) {
			// Return a simple success response if the email is equal to the user's current email
			return "Email updated successfully";
		}

		// update user data and save the new email address in the temporary field
		await this.profileRepository.update({ userId: id }, { new_email: email });

		// Create and save a new OTP code
		const otp: OtpEntity = await this.authService.saveOtp(id, AuthMethod.EMAIL);

		return {
			message: "OTP has been sent to your email address",
			code: otp.code
		};
	}

	/**
	 * User's email OTP verification controller
	 * @param otpDto - data sent by client
	 */
	async verifyEmail(otpDto: verifyEmailDto) {
		// extract user's id and new email address from request
		const { id: userId, profile: { new_email } } = this.request.user;

		const { code, email } = otpDto

		// Throw error if the email address in user's data and the email in token was not same
		if (email !== new_email) {
			throw new BadRequestException("Invalid email address");
		}

		// Validate the verification code sent by user by the one saved in database
		await this.checkOtp(userId, code, AuthMethod.EMAIL);

		// Update user's data
		await this.profileRepository.update(
			{ userId },
			{
				email,
				verify_email: true,
				new_email: null,
			}
		);

		return "Email address updated successfully"
	}

	/**
	 * Service of the process of updating user's phone number
	 * @param {string} phone - user's new phone number
	 */
	async changePhone(phone: string) {
		// extract user's id from request
		const { id } = this.request.user;

		// Retrieve user data by email
		const user: UserEntity = await this.userRepository.findOneBy({ phone });

		if (user && id !== user.id) {
			// Throw error if the phone is duplicated and don't belong to the user
			throw new ConflictException("Duplicated phone number");
		} else if (user && id === user.id) {
			// Return a simple success response if the phone is equal to the user's current phone
			return "phone updated successfully";
		}

		// update user data and save the new phone number in the temporary field
		await this.userRepository.update({ id }, { new_phone: phone });

		// Create and save a new OTP code
		const otp: OtpEntity = await this.authService.saveOtp(id, AuthMethod.PHONE);

		return {
			message: "OTP has been sent to your phone number",
			code: otp.code
		};
	}

	/**
	 * service of the process of verifying user's phone number
	 * @param {CheckOtpDto} otpDto - data sent by client
	 */
	async verifyPhone(otpDto: CheckOtpDto) {
		// extract user's id and new phone from request
		const { id: userId, new_phone }: UserEntity = this.request.user;

		// Destructure OTP data
		const { code, phone } = otpDto

		// Throw error if the phone address in user's data and the phone in token was not same
		if (phone !== new_phone) {
			throw new BadRequestException("Invalid phone number");
		}

		// Validate the verification code sent by user by the one saved in database
		await this.checkOtp(userId, code, AuthMethod.PHONE);

		// Update user's data
		await this.userRepository.update(
			{ id: userId },
			{
				phone,
				verify_phone: true,
				new_phone: null,
			}
		);

		return "Phone number updated successfully"
	}

	/**
	 * Validate the OTP code sent by user with the one saved in database
	 * @param userId - User's id
	 * @param code - the verification code sent by user
	 * @param method - The reason for otp usage
	 * @returns {Promise<OtpEntity>} - Return the OPT data
	 */
	private async checkOtp(userId: number, code: string, method: AuthMethod): Promise<OtpEntity> {
		// Retrieve OTP data from database
		const otp: OtpEntity = await this.otpRepository.findOneBy({ userId, method });

		// Throw error if the OTP was not found
		if (!otp) throw new BadRequestException("OTP code was not found");

		// Throw error if the OTP code has expired
		if (otp.expires_in < new Date())
			throw new BadRequestException("OTP code has expired");

		// Throw error if the code is invalid
		if (otp.code !== code)
			throw new BadRequestException("Incorrect OTP code");

		return otp;
	}
}
