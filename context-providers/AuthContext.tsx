import { useContext, createContext, type PropsWithChildren } from 'react';

import * as Localization from 'expo-localization';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { login } from '@/api/public/services/login.service';

import { profileQueryKey, userQueryKey } from '@/constants/Query';

import { useStorageState } from '@/hooks/storage/useStorageState';

import { LoginRequest } from '@/models/requests/Login.Request.Model';

import { getLanguageFile } from '@/utils/i18n.utils';

const AuthContext = createContext<{
	signIn: (credentials: LoginRequest) => void;
	signOut: () => void;
	session?: string | null;
	isLoading: boolean;
}>({
	signIn: () => null,
	signOut: () => null,
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

	const signIn = async (credentials: {
		username: string;
		password: string;
	}) => {
		// Perform API login request
		const data = await login(credentials);

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
		// Remove token from session state and secure storage
		await setSession(null);

		// Revert language to default language
		i18n.changeLanguage(Localization?.getLocales?.()[0]?.languageTag);

		// Remove cached data
		queryClient.clear();
	};

	return (
		<AuthContext.Provider
			value={{
				signIn,
				signOut,
				session,
				isLoading,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}
