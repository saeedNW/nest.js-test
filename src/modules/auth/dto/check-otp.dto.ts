import { Expose } from "class-transformer";
import { IsPhoneNumber, IsString, Length } from "class-validator";

export class CheckOtpDto {
	@IsString()
	@IsPhoneNumber("IR", { message: "Invalid phone number" })
	@Expose()
	phone: string;

	@IsString()
	@Length(5, 5, { message: "Invalid OTP code" })
	@Expose()
	code: string;
}
