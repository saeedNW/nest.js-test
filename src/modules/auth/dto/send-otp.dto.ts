import { Expose } from "class-transformer";
import { IsPhoneNumber, IsString } from "class-validator";

export class SendOtpDto {
	@IsString()
	@IsPhoneNumber("IR", { message: "Invalid phone number" })
	@Expose()
	phone: string;
}
