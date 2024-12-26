import { createContext, useContext, useEffect, useState } from 'react';

import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Toast } from 'toastify-react-native';

import AuthorizedAxiosInstance from '@/api/private/AuthorizedAxiosInstance';
import UnauthorizedAxiosInstance from '@/api/public/UnauthorizedAxiosInstance';

import { useStorageState } from '@/hooks/storage/useStorageState';

import { CustomAPIError } from '@/models/custom-errors/API.Error';

import { useSession } from './AuthContext';
import { useSocket } from './SocketContext';
import { useTranslation } from 'react-i18next';

interface AxiosHandlerProps {
	children: React.ReactNode;
}

const AxiosReadyContext = createContext<{
	interceptorsReady: boolean;
	setInterceptorsReady: (interceptors: boolean) => void;
}>({
	interceptorsReady: false,
	setInterceptorsReady: () => null,
});

export function useAxiosContext() {
	const value = useContext(AxiosReadyContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useAxiosContext must be wrapped in a <AxiosHandler />');
		}
	}

	return value;
}

const AxiosHandler: React.FC<AxiosHandlerProps> = ({ children }) => {
	const { t } = useTranslation();

	const [[_, session]] = useStorageState('session');

	const [interceptorsReady, setInterceptorsReady] = useState(false);

	const { socketID } = useSocket();
	const { signOut } = useSession();

	useEffect(() => {
		const onResponse = (response: AxiosResponse): AxiosResponse => {
			if (response.config.method !== 'get') {
				Toast.success('Success');
			}

			return response;
		};

		const onResponseError = (
			error: CustomAPIError
		): Promise<CustomAPIError> => {
			if (error.status === 401) Toast.error(t('Signed Out'));
			else {
				const errorMessage = error.messages?.[0] || 'An error occurred';
				Toast.error(errorMessage);
			}

			return Promise.reject(error);
		};

		const unauthorizedResponseInterceptor =
			UnauthorizedAxiosInstance.interceptors.response.use(
				onResponse,
				onResponseError
			);

		const authorizedResponseInterceptor =
			AuthorizedAxiosInstance.interceptors.response.use(
				onResponse,
				onResponseError
			);

		return () => {
			UnauthorizedAxiosInstance.interceptors.response.eject(
				unauthorizedResponseInterceptor
			);
			AuthorizedAxiosInstance.interceptors.response.eject(
				authorizedResponseInterceptor
			);
		};
	}, []);

	useEffect(() => {
		const onRequest = (config: InternalAxiosRequestConfig) => {
			// Attach API Access Token to request
			if (config.headers && session) {
				config.headers.Authorization = `Bearer ${session}`;
			}

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

		const onResponseError = (error: CustomAPIError) => {
			if (error.status === 401) signOut();
			return Promise.reject(error);
		};

		const responseInterceptor =
			AuthorizedAxiosInstance.interceptors.response.use(
				(response) => response,
				onResponseError
			);

		setInterceptorsReady(true);
		return () => {
			AuthorizedAxiosInstance.interceptors.request.eject(requestIntercepter);
			AuthorizedAxiosInstance.interceptors.response.eject(responseInterceptor);

			setInterceptorsReady(false);
		};
	}, [session, socketID, signOut]);

	return (
		<AxiosReadyContext.Provider
			value={{ interceptorsReady, setInterceptorsReady }}
		>
			{children}
		</AxiosReadyContext.Provider>
	);
};

export default AxiosHandler;
