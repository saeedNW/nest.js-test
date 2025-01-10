import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { plainToClass } from 'class-transformer';
import { CheckOtpDto } from './dto/check-otp.dto';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) { }

	/**
	 * create and send OTP code to user's phone number
	 * @param sendOtpDto - client data need to generate and send OTP code
	 */
	@Post("/send-otp")
	sendOtp(@Body() sendOtpDto: SendOtpDto) {
		sendOtpDto = plainToClass(SendOtpDto, sendOtpDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.sendOtp(sendOtpDto);
	}

	/**
	 * Validating client's OTP code
	 * @param checkOtpDto - Client's phone and OTP code
	 */
	@Post("/check-otp")
	checkOtp(@Body() checkOtpDto: CheckOtpDto) {
		checkOtpDto = plainToClass(CheckOtpDto, checkOtpDto, {
			excludeExtraneousValues: true,
		});

		return this.authService.checkOtp(checkOtpDto);
	}
}
