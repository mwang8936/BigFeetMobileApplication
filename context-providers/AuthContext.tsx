import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/hooks/storage/useStorageState';
import { LoginRequest } from '@/models/requests/Login.Request.Model';
import { login } from '@/api/public/services/login.service';
import { useTranslation } from 'react-i18next';

import { useQueryClient } from '@tanstack/react-query';
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

export function SessionProvider({ children }: PropsWithChildren) {
	const [[isLoading, session], setSession] = useStorageState('session');

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
		queryClient.setQueryData(['user'], user);

		// Change language to user setting
		i18n.changeLanguage(user.language);

		// Save token in session state and secure storage
		setSession(accessToken);
	};

	const signOut = () => {
		// Remove cached data
		queryClient.clear();

		// Revert language to default English
		i18n.changeLanguage('English');

		// Remove token from session state and secure storage
		setSession(null);
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
