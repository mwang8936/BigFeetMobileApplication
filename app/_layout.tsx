import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { I18nextProvider } from 'react-i18next';
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ToastManager from 'toastify-react-native';

import { SessionProvider } from '@/context-providers/AuthContext';
import AxiosHandler from '@/context-providers/AxiosHandler';
import { SocketProvider } from '@/context-providers/SocketContext';

import i18n from '@/utils/i18n.utils';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const isDarkMode = colorScheme === 'dark';

	const [loaded] = useFonts({
		SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	const queryClient = new QueryClient();

	return (
		<I18nextProvider i18n={i18n}>
			<QueryClientProvider client={queryClient}>
				<SessionProvider>
					<SocketProvider>
						<AxiosHandler>
							<GestureHandlerRootView
								style={{
									flex: 1,
									backgroundColor: isDarkMode ? '#000' : '#fff',
								}}
							>
								<ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
									<ToastManager
										textStyle={{ color: isDarkMode ? '#fff' : '#000' }}
										style={{
											height: 'auto',
											backgroundColor: isDarkMode ? '#333' : '#fff',
										}}
									/>

									<Slot />
								</ThemeProvider>
							</GestureHandlerRootView>
						</AxiosHandler>
					</SocketProvider>
				</SessionProvider>
			</QueryClientProvider>
		</I18nextProvider>
	);
}
