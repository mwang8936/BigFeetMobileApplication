import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useState,
} from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface NotificationContextProps {
	expoPushToken: string;
	hasPermission: boolean;
}

const NotificationContext = createContext<NotificationContextProps>({
	expoPushToken: '',
	hasPermission: false,
});

export const useNotification = () => {
	const context = useContext(NotificationContext);
	if (process.env.NODE_ENV !== 'production') {
		if (!context) {
			throw new Error(
				'useNotification must be wrapped in <NotificationHandler />'
			);
		}
	}
	return context;
};

export function NotificationHandler({ children }: PropsWithChildren) {
	const [expoPushToken, setExpoPushToken] = useState<string>('');
	const [hasPermission, setHasPermission] = useState<boolean>(false);

	useEffect(() => {
		async function registerForPushNotificationsAsync() {
			if (!Device.isDevice) {
				console.warn('Must use physical device for Push Notifications');
				setHasPermission(false);
				return;
			}

			if (Platform.OS === 'android') {
				await Notifications.setNotificationChannelAsync('default', {
					name: 'default',
					importance: Notifications.AndroidImportance.MAX,
					vibrationPattern: [0, 250, 250, 250],
					lightColor: '#FF231F7C',
				});
			}

			const { status: existingStatus } =
				await Notifications.getPermissionsAsync();
			let finalStatus = existingStatus;

			if (existingStatus !== 'granted') {
				const { status } = await Notifications.requestPermissionsAsync();
				finalStatus = status;
			}

			const permissionGranted = finalStatus === 'granted';
			setHasPermission(permissionGranted);

			if (!permissionGranted) {
				console.warn('Push notification permission not granted');
				return;
			}

			const projectId =
				Constants?.expoConfig?.extra?.eas?.projectId ??
				Constants?.easConfig?.projectId;

			if (!projectId) {
				console.warn('Project ID not found');
				return;
			}

			try {
				const tokenData = await Notifications.getExpoPushTokenAsync({
					projectId,
				});
				setExpoPushToken(tokenData.data);
			} catch (error) {
				console.error('Error getting Expo push token:', error);
			}
		}

		registerForPushNotificationsAsync();
	}, []);

	return (
		<NotificationContext.Provider value={{ expoPushToken, hasPermission }}>
			{children}
		</NotificationContext.Provider>
	);
}
