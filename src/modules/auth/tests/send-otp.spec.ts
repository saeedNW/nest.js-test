import { UnprocessableEntityPipe } from 'src/common/pipe/unprocessable-entity.pipe';
import { UnprocessableEntityException } from '@nestjs/common';
import { SendOtpDto } from '../dto/send-otp.dto';

describe('SendOtpDto', () => {
	it('should throw validation error for invalid phone number', async () => {
		const invalidPhone = { phone: "0911111" }; // Invalid data

		// Apply ValidationPipe to simulate validation
		const validationPipe = new UnprocessableEntityPipe();

		await expect(
			validationPipe.transform(invalidPhone, {
				type: 'body',
				metatype: SendOtpDto,
			}),
		).rejects.toThrow(UnprocessableEntityException);
	});

	it('Should throw validation error for empty phone number', async function () {
		const invalidPhone = { phone: "" }; // Invalid data

		// Apply ValidationPipe to simulate validation
		const validationPipe = new UnprocessableEntityPipe();

		await expect(
			validationPipe.transform(invalidPhone, {
				type: 'body',
				metatype: SendOtpDto,
			}),
		).rejects.toThrow(UnprocessableEntityException);
	});
});
