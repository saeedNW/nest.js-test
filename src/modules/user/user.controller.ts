import { Body, Controller, Get, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ProfileDto } from './dto/profile.dto';
import { plainToClass } from 'class-transformer';
import { objectSanitizer } from 'src/common/utils/object-sanitizer.utility';
import { ChangeEmailDto, verifyEmailDto } from './dto/change-email.dto';
import { ChangePhoneDto } from './dto/change-phone.dto';
import { CheckOtpDto } from '../auth/dto/check-otp.dto';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
	constructor(private readonly userService: UserService) { }

	/**
	 * Controller of the process of updating user profile information
	 * @param {ProfileDto} profileDto - Profile data sent by user to be updated
	 */
	@Put("/profile")
	changeProfile(@Body() profileDto: ProfileDto) {
		profileDto = plainToClass(ProfileDto, profileDto, {
			excludeExtraneousValues: true,
		});

		/** Remove invalid data */
		objectSanitizer(profileDto);

		return this.userService.changeProfile(profileDto);
	}

	/**
	 * Controller of the process of retrieving user's profile data
	 */
	@Get("/profile")
	grtProfile() {
		return this.userService.getProfile();
	}

	/**
	 * update user's email process controller
	 * @param {ChangeEmailDto} emailDto - the data sent by client
	 */
	@Patch("/change-email")
	changeEmail(@Body() emailDto: ChangeEmailDto) {
		return this.userService.changeEmail(emailDto.email);
	}

	/**
	 * User's email OTP verification controller
	 * @param otpDto - data sent by client
	 */
	@Post("/verify-email")
	verifyEmail(@Body() otpDto: verifyEmailDto) {
		return this.userService.verifyEmail(otpDto);
	}

	/**
	 * update user's phone process controller
	 * @param {ChangePhoneDto} phoneDto - the data sent by client
	 */
	@Patch("/change-phone")
	changePhone(@Body() phoneDto: ChangePhoneDto) {
		return this.userService.changePhone(phoneDto.phone);
	}

	/**
	 * User's phone OTP verification controller
	 * @param {CheckOtpDto} otpDto - data sent by client
	 */
	@Post("/verify-phone")
	verifyPhone(@Body() otpDto: CheckOtpDto) {
		return this.userService.verifyPhone(otpDto);
	}
}
