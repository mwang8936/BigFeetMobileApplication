import UnauthorizedAxiosInstance from '../UnauthorizedAxiosInstance';

import { loginPath } from '@/constants/API';

import {
	LoginRequest,
	LoginResponse,
} from '@/models/requests/Login.Request.Model';

export const login = async (request: LoginRequest): Promise<LoginResponse> => {
	const response = await UnauthorizedAxiosInstance.post<LoginResponse>(
		loginPath,
		request
	);

	return response.data;
};
