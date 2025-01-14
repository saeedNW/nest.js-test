export const MockAuthService_UserModule = {
	saveOtp: jest.fn((criteria) => {
		return {
			id: 1,
			code: "12345",
			expires_in: new Date(Date.now() + 1000 * 60 * 2),
			method: criteria.method,
			userId: 2
		}
	})
};
