export const MockProfileRepository_UserModule = {
	findOneBy: jest.fn()
		.mockImplementationOnce(userId => Promise.resolve({
			id: 1,
			fullname: 'Saeed Norouzi',
			nickname: 'saeed',
			bio: null,
			email: 'example@example.com',
			new_email: null,
			verify_email: true,
			gender: 'male',
			birthday: null,
			linkedin_profile: null,
			userId: 2
		}))
		.mockImplementationOnce(userId => Promise.resolve(null)),
	create: jest.fn(criteria => criteria),
	save: jest.fn(profile => Promise.resolve({
		...profile,
		id: 2,
	})),
}
