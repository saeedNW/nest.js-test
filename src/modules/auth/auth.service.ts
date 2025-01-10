import { BadRequestException, Inject, Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OtpEntity } from '../user/entities/otp.entity';
import { TokenService } from './token.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { randomInt } from 'crypto';
import { CheckOtpDto } from './dto/check-otp.dto';
import { AuthMethod } from './enums/method.enum';
import { ProfileEntity } from '../user/entities/profile.entity';

@Injectable()
export class AuthService {
	constructor(
		// inject user repository
		@InjectRepository(UserEntity)
		private userRepository: Repository<UserEntity>,

		// inject otp repository
		@InjectRepository(OtpEntity)
		private otpRepository: Repository<OtpEntity>,

		// Register token service
		private tokenService: TokenService,
	) { }

	/**
	 * create and send OTP code to user's phone number
	 * @param sendOtpDto - client data need to generate and send OTP code
	 */
	async sendOtp(sendOtpDto: SendOtpDto) {
		// destructure client data
		const { phone } = sendOtpDto;

		// retrieve user's data from database
		let user: UserEntity = await this.getUser(phone);

		if (!user) {
			// create new user and save it in database
			user = this.userRepository.create({ phone });
			user = await this.userRepository.save(user);
		}

		// create OTP data
		const otp: OtpEntity = await this.saveOtp(user.id);

		return { code: otp.code }
	}

	/**
	 * Retrieve user's data based on the given phone number
	 * @param {string} phone - The input data sent by client
	 * @returns {Promise<UserEntity> | null} Return the retrieved user from database
	 */
	private async getUser(phone: string): Promise<UserEntity> | null {
		return await this.userRepository.findOneBy({ phone });
	}

	/**
	 * Create new OTP code and save it in database if needed
	 * @param {number} userId - User's data id
	 * @param {AuthMethod} method - The reason for otp usage
	 * @returns {Promise<OtpEntity>} - returns OTP data
	 */
	async saveOtp(userId: number, method?: AuthMethod): Promise<OtpEntity> {
		// create a random 5 digit number
		const code: string = randomInt(10000, 99999).toString();
		// set the expires time of the OTP for 2 min
		const expires_in = new Date(Date.now() + 1000 * 60 * 2);

		// check if user already has an otp or not
		let otp: OtpEntity = await this.otpRepository.findOneBy({ userId });

		// Define a boolean to be used in case of new OTP
		let newOtp: boolean = true;

		if (otp) {
			newOtp = false;

			// throw error if OTP not expired
			if (otp.expires_in > new Date()) {
				throw new BadRequestException("OTP code is not expire");
			}

			// update otp data
			otp.code = code;
			otp.expires_in = expires_in;
			otp.method = method
		} else {
			// create new otp
			otp = this.otpRepository.create({ code, expires_in, userId, method });
		}

		// save otp data
		otp = await this.otpRepository.save(otp);

		// update user's otp data in case if the OTP is newly created
		if (newOtp) {
			await this.userRepository.update({ id: userId }, { otpId: otp.id });
		}

		return otp;
	}

	/**
	 * OTP code verification
	 * @param checkOtpDto - User's phone and OTP code
	 */
	async checkOtp(checkOtpDto: CheckOtpDto) {
		const { code, phone } = checkOtpDto;

		// retrieve user's data
		const { id: userId, verify_phone } = await this.getUser(phone)

		// Retrieve OTP data
		const otp = await this.otpRepository.findOne({
			where: { userId, code },
		});

		// Throw error if OTP was not found
		if (!otp) {
			throw new UnauthorizedException("Authorization failed, please retry");
		}

		const now = new Date();

		// Throw error if OTP was expired
		if (otp.expires_in < now) {
			throw new UnauthorizedException("OTP code expired");
		}

		// Throw error if OTP code was invalid
		if (otp.code !== code) {
			throw new UnauthorizedException("Invalid OTP code");
		}

		// create client's access token
		const accessToken = this.tokenService.createAccessToken({ userId });

		// VERIFY USER'S PHONE NUMBER
		if (!verify_phone) {
			await this.userRepository.update(
				{ id: userId },
				{
					verify_phone: true,
				}
			);
		}

		return {
			message: "You have logged in successfully",
			accessToken,
		};
	}

	/**
	 * Clients' access token validation process
	 * @param {string} token - Access token retrieved from client's request
	 * @throws {UnauthorizedException} - In case of invalid token throw "Unauthorized Exception" error
	 * @returns {Promise<UserEntity | never>} - Returns user's data or throw an error
	 */
	async validateAccessToken(token: string): Promise<UserEntity & { profile: ProfileEntity } | never> {
		// extract user's id from access token
		const { userId } = this.tokenService.verifyAccessToken(token);

		// retrieve user's data from database
		const user = await this.userRepository.findOne({ where: { id: userId }, relations: ["profile"], });

		// throw error if user was not found
		if (!user) {
			throw new UnauthorizedException("Authorization failed, please retry");
		}

		return user;
	}
}
