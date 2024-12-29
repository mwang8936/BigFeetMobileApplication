import { ExpoConfig, ConfigContext } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
	return {
		...config,
		name: 'BFC',
		slug: 'BFC',
		newArchEnabled: true,
		version: '1.0.0',
		orientation: 'portrait',
		icon: './assets/images/icon.png',
		scheme: 'BFC',
		userInterfaceStyle: 'automatic',
		splash: {
			image: './assets/images/splash.png',
			resizeMode: 'contain',
			backgroundColor: '#fff200',
		},
		ios: {
			supportsTablet: true,
		},
		android: {
			adaptiveIcon: {
				foregroundImage: './assets/images/adaptive-icon.png',
				backgroundColor: '#ffffff',
			},
		},
		web: {
			bundler: 'metro',
			output: 'static',
			favicon: './assets/images/favicon.png',
		},
		plugins: [
			'expo-router',
			'expo-secure-store',
			'expo-font',
			'expo-localization',
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			environment: process.env.NODE_ENV,
			apiUrl: process.env.BASE_API_URL,
			pusherKey: process.env.PUSHER_KEY,
			pusherCluster: process.env.PUSHER_CLUSTER,
		},
	};
};
