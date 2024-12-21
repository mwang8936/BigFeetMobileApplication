import User from '../User.Model';

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: User;
	accessToken: string;
}
