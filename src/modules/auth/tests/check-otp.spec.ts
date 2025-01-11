import { UnprocessableEntityPipe } from 'src/common/pipe/unprocessable-entity.pipe';
import { UnprocessableEntityException } from '@nestjs/common';
import { CheckOtpDto } from '../dto/check-otp.dto';

describe('CheckOtpDto', () => {
	it('Should throw validation error for empty phone number', async function () {
		const invalidDto = { phone: "", code: "12345" }; // Invalid data

		// Apply ValidationPipe to simulate validation
		const validationPipe = new UnprocessableEntityPipe();

		await expect(
			validationPipe.transform(invalidDto, {
				type: 'body',
				metatype: CheckOtpDto,
			}),
		).rejects.toThrow(UnprocessableEntityException);
	});

	it('should throw validation error for invalid phone number', async () => {
		const invalidDto = { phone: "0911111", code: "12345" }; // Invalid data

		// Apply ValidationPipe to simulate validation
		const validationPipe = new UnprocessableEntityPipe();

		await expect(
			validationPipe.transform(invalidDto, {
				type: 'body',
				metatype: CheckOtpDto,
			}),
		).rejects.toThrow(UnprocessableEntityException);
	});

	it('Should throw validation error for empty code', async function () {
		const invalidDto = { phone: "09111111111", code: "" }; // Invalid data

		// Apply ValidationPipe to simulate validation
		const validationPipe = new UnprocessableEntityPipe();

		await expect(
			validationPipe.transform(invalidDto, {
				type: 'body',
				metatype: CheckOtpDto,
			}),
		).rejects.toThrow(UnprocessableEntityException);
	});

	it('Should throw validation error for invalid code length', async function () {
		const invalidDto = { phone: "09111111111", code: "123" }; // Invalid data

		// Apply ValidationPipe to simulate validation
		const validationPipe = new UnprocessableEntityPipe();

		await expect(
			validationPipe.transform(invalidDto, {
				type: 'body',
				metatype: CheckOtpDto,
			}),
		).rejects.toThrow(UnprocessableEntityException);
	});
});
