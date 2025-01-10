import { Expose } from "class-transformer";
import { IsEmail, IsString, Length } from "class-validator";

/**
 * Create a dto for the process of updating user's email address
 */
export class ChangeEmailDto {
	@IsEmail({}, { message: "Invalid email address" })
	@Expose()
	email: string;
}

export class verifyEmailDto {
	@IsEmail({}, { message: "Invalid email address" })
	@Expose()
	email: string;
	
	@IsString()
	@Length(5, 5, { message: "Invalid OTP code" })
	@Expose()
	code: string;
}
