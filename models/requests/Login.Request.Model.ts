import User from '../User.Model';

export interface LoginRequest {
	username: string;
	password: string;
	device_id?: string;
	device_model?: string;
	device_name?: string;
	push_token?: string;
}

export interface LoginResponse {
	user: User;
	accessToken: string;
}
