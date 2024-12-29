import { createContext, useContext, useEffect, useState } from 'react';

import { InternalAxiosRequestConfig } from 'axios';

import AuthorizedAxiosInstance from '@/api/private/AuthorizedAxiosInstance';

import { CustomAPIError } from '@/models/custom-errors/API.Error';

import { useSession } from './AuthContext';
import { useSocket } from './SocketContext';

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
	const [interceptorsReady, setInterceptorsReady] = useState(false);

	const { socketID } = useSocket();
	const { session, signOut } = useSession();

	useEffect(() => {
		const onRequest = (config: InternalAxiosRequestConfig) => {
			// Attach API Access Token to request
			if (config.headers && session) {
				config.headers.Authorization = `Bearer ${session}`;
			}

			return config;
		};

		const requestIntercepter = AuthorizedAxiosInstance.interceptors.request.use(
			onRequest,
			(error) => error
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

		if (session) setInterceptorsReady(true);
		return () => {
			AuthorizedAxiosInstance.interceptors.request.eject(requestIntercepter);
			AuthorizedAxiosInstance.interceptors.response.eject(responseInterceptor);

			setInterceptorsReady(false);
		};
	}, [session, signOut]);

	useEffect(() => {
		const onRequest = (config: InternalAxiosRequestConfig) => {
			// Attach Socket ID to header
			if (socketID) {
				config.headers.set('x-socket-id', socketID);
			}

			return config;
		};

		const requestIntercepter = AuthorizedAxiosInstance.interceptors.request.use(
			onRequest,
			(error) => error
		);

		return () => {
			AuthorizedAxiosInstance.interceptors.request.eject(requestIntercepter);
		};
	}, [socketID]);

	return (
		<AxiosReadyContext.Provider
			value={{ interceptorsReady, setInterceptorsReady }}
		>
			{children}
		</AxiosReadyContext.Provider>
	);
};

export default AxiosHandler;
