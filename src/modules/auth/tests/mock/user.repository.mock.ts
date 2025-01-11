let findOneByCallCount = 0;

export const MockUserRepository = {
	findOneBy: jest.fn((criteria) => {
		findOneByCallCount++;
		if (findOneByCallCount === 1) {
			// The first call in sendOtp
			return Promise.resolve(null);
		}
		if (findOneByCallCount >= 2) {
			// Other calls in checkOtp
			return Promise.resolve({
				id: 2,
				verify_phone: false,
			});
		}
	}),
	findOne: jest.fn()
		// First call successful token verification
		.mockImplementationOnce(criteria => Promise.resolve({
			id: 2,
			phone: '09172222222',
		}))
		// Second call throw error on user not found
		.mockImplementationOnce(criteria => Promise.resolve(null)),
	create: jest.fn(phone => phone),
	save: jest.fn(user => Promise.resolve({
		...user,
		id: 2,
	})),
	update: jest.fn((criteria, partialEntity) => Promise.resolve({ affected: 1 })),
}
