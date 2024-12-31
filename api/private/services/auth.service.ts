import AuthorizedAxiosInstance from '../AuthorizedAxiosInstance';

import { authenticatePath } from '@/constants/API';

export const authenticate = async (): Promise<void> => {
	await AuthorizedAxiosInstance.post<void>(authenticatePath);
};
