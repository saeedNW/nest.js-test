let findOneCallCount = 0;

export const MockOtpRepository = {
	findOne: jest.fn(whereOption => {
		findOneCallCount++;
		if (findOneCallCount === 2) {
			// The second call for null otp error test
			return Promise.resolve(null);
		}

		if (findOneCallCount === 3) {
			// The third call for expired otp error test
			return Promise.resolve({
				id: 5,
				code: '12345',
				expires_in: new Date(Date.now() - 1000 * 60 * 4),
				method: null,
				userId: 2
			});
		}

		// Other calls in checkOtp
		return Promise.resolve({
			id: 5,
			code: '12345',
			expires_in: new Date(Date.now() + 1000 * 60 * 2),
			method: null,
			userId: 2
		});
	}),
	findOneBy: jest.fn(userId => Promise.resolve(null)),
	create: jest.fn(otpDate => otpDate),
	save: jest.fn(otp => Promise.resolve({
		...otp,
		id: 10,
	}))
}
