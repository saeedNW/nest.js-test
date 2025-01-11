export const MockTokenService = {
	createAccessToken: jest.fn(payload => { return "JWT TOKEN" }),
	verifyAccessToken: jest.fn(token => { return { userId: 2 } })
}
