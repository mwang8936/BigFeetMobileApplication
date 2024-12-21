import { createContext, useContext, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/context-providers/AuthContext';
import { ActivityIndicator, Text, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/(tabs)/TabBarIcon';
import AuthorizedAxiosHandler from '@/context-providers/AuthorizedAxiosHandler';
import { SocketProvider } from '@/context-providers/SocketContext';

export default function TabLayout() {
	const { session, isLoading } = useSession();

	// Show a loading indicator while checking auth status
	if (isLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	// Only require authentication within the (app) group's layout as users
	// need to be able to access the (auth) group and sign in again.
	if (!session) {
		// On web, static rendering will stop here as the user is not authenticated
		// in the headless Node process that the pages are rendered in.
		return <Redirect href="/login" />;
	}

	const colorScheme = useColorScheme();
	const color = Colors[colorScheme ?? 'light'];

	const [socketID, setSocketID] = useState<string>('');

	return (
		<SocketProvider>
			<AuthorizedAxiosHandler>
				<Tabs
					screenOptions={{
						tabBarActiveTintColor: color.tint,
						headerStyle: {
							backgroundColor: color.background,
						},
						headerShadowVisible: false,
						headerTintColor: color.tint,
						tabBarStyle: {
							backgroundColor: color.background,
						},
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							title: 'Scheduler',
							tabBarIcon: ({ color, focused }) => (
								<TabBarIcon
									name={focused ? 'calendar-sharp' : 'calendar-outline'}
									color={color}
								/>
							),
						}}
					/>

					<Tabs.Screen
						name="payroll"
						options={{
							title: 'Payroll',
							tabBarIcon: ({ color, focused }) => (
								<TabBarIcon
									name={focused ? 'cash-sharp' : 'cash-outline'}
									color={color}
								/>
							),
						}}
					/>

					<Tabs.Screen
						name="profile"
						options={{
							title: 'Profile',
							tabBarIcon: ({ color, focused }) => (
								<TabBarIcon
									name={
										focused ? 'person-circle-sharp' : 'person-circle-outline'
									}
									color={color}
								/>
							),
						}}
					/>
				</Tabs>
			</AuthorizedAxiosHandler>
		</SocketProvider>
	);
}
