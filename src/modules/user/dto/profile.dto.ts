import { IsDateString, IsEnum, IsOptional, Length } from "class-validator";
import { Gender } from "../enums/gender.enum";
import { Expose } from "class-transformer";

export class ProfileDto {
	@IsOptional()
	@Length(3, 100)
	@Expose()
	fullname: string;

	@IsOptional()
	@Length(3, 100)
	@Expose()
	nickname: string;

	@IsOptional()
	@Length(10, 200)
	@Expose()
	bio: string;

	@IsOptional()
	@IsEnum(Gender)
	@Expose()
	gender: string;

	@IsOptional()
	@IsDateString()
	@Expose()
	birthday: Date;

	@IsOptional()
	@Length(3, 15)
	@Expose()
	linkedin_profile: string;
}
