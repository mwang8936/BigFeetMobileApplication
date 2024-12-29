import { createContext, useContext, useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import { Redirect, Stack } from 'expo-router';
import { useSession } from '@/context-providers/AuthContext';
import { ActivityIndicator, Text, useColorScheme, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';

import { TabBarIcon } from '@/components/(tabs)/TabBarIcon';
import { PayrollDateProvider } from '@/context-providers/PayrollDateContext';
import { useTranslation } from 'react-i18next';
import { useAxiosContext } from '@/context-providers/AxiosHandler';
import {
	prefetchUserAcupunctureReportsQuery,
	prefetchUserPayrollsQuery,
	prefetchUserSchedulesQuery,
	useUserQuery,
} from '@/hooks/react-query/profile.hooks';
import { getLanguageFile } from '@/utils/i18n.utils';
import { ScheduleDateProvider } from '@/context-providers/ScheduleDateContext';

export default function TabLayout() {
	const { i18n, t } = useTranslation();

	const { session, isLoading: sessionLoading } = useSession();
	const { interceptorsReady } = useAxiosContext();

	const { data: user, isLoading: userLoading } = useUserQuery(
		!sessionLoading && interceptorsReady
	);

	useEffect(() => {
		if (!sessionLoading && interceptorsReady) {
			prefetchUserSchedulesQuery();
			prefetchUserAcupunctureReportsQuery();
			prefetchUserPayrollsQuery();
		}
	}, [sessionLoading, interceptorsReady]);

	useEffect(() => {
		if (user) {
			i18n.changeLanguage(getLanguageFile(user.language));
		} else {
			i18n.changeLanguage(Localization?.getLocales?.()[0]?.languageTag);
		}
	}, [user]);
	const colorScheme = useColorScheme();
	const color = Colors[colorScheme ?? 'light'];

	// Only require authentication within the (app) group's layout as users
	// need to be able to access the (auth) group and sign in again.
	if (!session) {
		// On web, static rendering will stop here as the user is not authenticated
		// in the headless Node process that the pages are rendered in.
		return <Redirect href="/login" />;
	}

	// Show a loading indicator while checking auth status
	if (userLoading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	return (
		<ScheduleDateProvider>
			<PayrollDateProvider>
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
							title: t('Scheduler'),
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
							title: t('Payroll'),
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
							title: t('Profile'),
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
			</PayrollDateProvider>
		</ScheduleDateProvider>
	);
}
