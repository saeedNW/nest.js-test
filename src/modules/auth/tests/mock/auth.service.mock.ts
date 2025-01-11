export const MockAuthService = {
	sendOtp: jest.fn(dto => {
		return { code: "32313" }
	}),

	checkOtp: jest.fn(dto => {
		return {
			message: "You have logged in successfully",
			accessToken: "JWT Token"
		}
	})
};
