import { IsMobilePhone } from "class-validator";

/**
 * Create a dto for the process of updating user's phone number
 */
export class ChangePhoneDto {
	@IsMobilePhone("fa-IR", {}, { message: "Invalid phone number" })
	phone: string;
}
