import { Language } from '../enums';

export interface UpdateProfileRequest {
	language?: Language;
}

export interface ChangeProfilePasswordRequest {
	old_password: string;
	new_password: string;
}

export interface RegisterDeviceRequest {
	device_id: string;
	device_model?: string;
	device_name?: string;
	push_token?: string;
}
