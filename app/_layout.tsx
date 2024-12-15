import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
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

	// // Replace this with actual authentication logic
	// const [isAuthenticated, setIsAuthenticated] = useState(false);
	// const [loading, setLoading] = useState(true);

	// // Simulate a loading effect (replace with real authentication check)
	// useEffect(() => {
	// 	const checkAuthStatus = async () => {
	// 		// Simulate async auth check
	// 		setTimeout(() => {
	// 			// Set `isAuthenticated` to true if user is logged in
	// 			setIsAuthenticated(false); // Set to true for testing logged-in state
	// 			setLoading(false);
	// 		}, 1000);
	// 	};

	// 	checkAuthStatus();
	// }, []);

	// // Show a loading indicator while checking auth status
	// if (loading) {
	// 	return (
	// 		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
	// 			<ActivityIndicator size="large" color="#0000ff" />
	// 		</View>
	// 	);
	// }

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: '#ff0000' }}>
			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<Stack screenOptions={{ headerShown: false }}>
					<Stack.Screen name="login" />

					<Stack.Screen name="(tabs)" />

					<Stack.Screen name="+not-found" />
				</Stack>
			</ThemeProvider>
		</GestureHandlerRootView>
	);
}
