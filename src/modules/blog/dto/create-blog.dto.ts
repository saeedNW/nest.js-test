import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsNumberString, Length } from "class-validator";

export class CreateBlogDto {
	@IsNotEmpty()
	@Length(10, 150)
	@Expose()
	title: string;

	@IsNotEmpty()
	@Length(10, 300)
	@Expose()
	description: string;

	@IsNotEmpty()
	@Length(100)
	@Expose()
	content: string;

	@IsNotEmpty()
	@IsNumberString()
	@Expose()
	time_for_study: string;
}
