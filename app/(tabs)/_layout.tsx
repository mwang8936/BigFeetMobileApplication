import { useColorScheme } from 'react-native';

import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/(tabs)/TabBarIcon';

import { Colors } from '@/constants/Colors';

export default function TabLayout() {
	const colorScheme = useColorScheme();

	const color = Colors[colorScheme ?? 'light'];

	return (
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
			}}>
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
							name={focused ? 'person-circle-sharp' : 'person-circle-outline'}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
