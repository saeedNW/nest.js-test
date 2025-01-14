export const MockUserService_UserModule = {
	changeProfile: jest.fn(profileDto => "Profile updated successfully"),
	getProfile: jest.fn(() => {
		return {
			fullname: "Saeed Norouzi",
			nickname: "tester",
			bio: "this is my profile bio",
			gender: 'male',
			birthday: new Date(),
			linkedin_profile: "Linkedin"
		}
	}),
	changeEmail: jest.fn(emailDto => {
		return {
			message: "OTP has been sent to your email address",
			code: "12345"
		}
	}),
	verifyEmail: jest.fn(emailOtpDto => "Email address updated successfully"),
	changePhone: jest.fn(phoneDto => {
		return {
			message: "OTP has been sent to your phone number",
			code: "12345"
		}
	}),
	verifyPhone: jest.fn(phoneOtpDto => "Phone number updated successfully")
}
