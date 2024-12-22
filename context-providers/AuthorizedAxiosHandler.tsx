import { useEffect } from 'react';

import { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AuthorizedAxiosInstance from '@/api/private/AuthorizedAxiosInstance';
import { useSession } from './AuthContext';
import { useSocket } from './SocketContext';

interface AuthorizedAxiosHandlerProps {
	children: React.ReactNode;
}

const AuthorizedAxiosHandler: React.FC<AuthorizedAxiosHandlerProps> = ({
	children,
}) => {
	const { socketID } = useSocket();
	const { signOut } = useSession();

	useEffect(() => {
		const onRequest = (config: InternalAxiosRequestConfig) => {
			if (socketID) {
				config.headers.set('x-socket-id', socketID);
			}

			return config;
		};

		const requestIntercepter = AuthorizedAxiosInstance.interceptors.request.use(
			onRequest,
			async (error) => {
				return Promise.reject(error);
			}
		);

		const onResponseError = (error: AxiosError) => {
			if (error.response?.status === 401) signOut();
			return Promise.reject(error);
		};

		const responseInterceptor =
			AuthorizedAxiosInstance.interceptors.response.use(
				(response) => response,
				onResponseError
			);

		return () => {
			AuthorizedAxiosInstance.interceptors.request.eject(requestIntercepter);
			AuthorizedAxiosInstance.interceptors.response.eject(responseInterceptor);
		};
	}, [socketID, signOut]);

	return children;
};

export default AuthorizedAxiosHandler;
