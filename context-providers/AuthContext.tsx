import { useContext, createContext, type PropsWithChildren } from 'react';

import { AxiosError } from 'axios';
import * as Localization from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { login } from '@/api/public/services/login.service';
import { refresh as refreshAPI } from '@/api/public/services/refresh.service';

import { logout } from '@/api/private/services/profile.service';

import { profileQueryKey, userQueryKey } from '@/constants/Query';

import { useStorageState } from '@/hooks/storage/useStorageState';

import { LoginRequest } from '@/models/requests/Login.Request.Model';
import { LogoutRequest } from '@/models/requests/Profile.Request.Model';

import { getLanguageFile } from '@/utils/i18n.utils';

import { useDeviceInfo } from '../hooks/device-info/useDeviceInfo';

const AuthContext = createContext<{
	signIn: (credentials: { username: string; password: string }) => void;
	signOut: () => void;
	refresh: () => void;
	session?: string | null;
	isLoading: boolean;
}>({
	signIn: () => null,
	signOut: () => null,
	refresh: () => null,
	session: null,
	isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
	const value = useContext(AuthContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!value) {
			throw new Error('useSession must be wrapped in a <SessionProvider />');
		}
	}

	return value;
}

export const sessionKey = 'session';

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState(sessionKey);

	const queryClient = useQueryClient();
	const { i18n } = useTranslation();
	const { deviceId, deviceModel, deviceName } = useDeviceInfo();

	const signIn = async (credentials: {
		username: string;
		password: string;
	}) => {
		const request: LoginRequest = {
			username: credentials.username,
			password: credentials.password,
			device_id: deviceId,
			device_model: deviceModel,
			device_name: deviceName,
		};

		// Perform API login request
		const data = await login(request);

		// Extract token from the response
		const { user, accessToken } = data;

		// Add user data to cache
		queryClient.setQueryData([userQueryKey, profileQueryKey], user);

		// Change language to user setting
		i18n.changeLanguage(getLanguageFile(user.language));

		// Save token in session state and secure storage
		await setSession(accessToken);
	};

	const signOut = async () => {
		if (deviceId) {
			const request: LogoutRequest = {
				device_id: deviceId,
			};
			try {
				await logout(request);
			} catch (error) {
				if (error instanceof AxiosError) {
					console.error('Logout Failed', error.message);
				}
			}
		}
		// Remove token from session state and secure storage
		await setSession(null);

		// Revert language to default language
		i18n.changeLanguage(Localization?.getLocales?.()[0]?.languageTag);

		// Remove cached data
		queryClient.clear();
	};

	const refresh = async () => {
		try {
			// Perform API refresh request
			const data = await refreshAPI();

			// Extract token from the response
			const { user, accessToken } = data;

			// Add user data to cache
			queryClient.setQueryData([userQueryKey, profileQueryKey], user);

			// Change language to user setting
			i18n.changeLanguage(getLanguageFile(user.language));

			// Save token in session state and secure storage
			await setSession(accessToken);
		} catch (error) {
			if (error instanceof AxiosError) {
				console.error('Refresh Failed', error.message);
			}
			// Remove token from session state and secure storage
			await setSession(null);

			// Revert language to default language
			i18n.changeLanguage(Localization?.getLocales?.()[0]?.languageTag);

			// Remove cached data
			queryClient.clear();
		}
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				refresh,
				session,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
