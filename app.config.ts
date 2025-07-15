import { ExpoConfig, ConfigContext } from '@expo/config';

const getBundleId = () => {
	const appVariant = process.env.APP_VARIANT;

	switch (appVariant) {
		case 'production':
			return 'com.mwang8936.bfc';
		case 'preview':
			return 'com.mwang8936.bfc.preview';
		default:
			return 'com.mwang8936.bfc.dev';
	}
};

const bundleID = getBundleId();

const getAppName = () => {
	const appVariant = process.env.APP_VARIANT;
	switch (appVariant) {
		case 'production':
			return 'BFC';
		case 'preview':
			return 'BFC (Preview)';
		default:
			return 'BFC (Dev)';
	}
};

export default ({ config }: ConfigContext): ExpoConfig => {
	return {
		...config,
		name: getAppName(),
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
			bundleIdentifier: bundleID,
			supportsTablet: true,
			config: {
				usesNonExemptEncryption: false,
			},
		},
		android: {
			package: bundleID,
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
			'expo-web-browser',
			'expo-router',
			'expo-secure-store',
			'expo-font',
			'expo-localization',
			'expo-notifications',
		],
		experiments: {
			typedRoutes: true,
		},
		extra: {
			eas: {
				projectId: 'e3b798be-6136-4f73-858b-9911e367ec72',
			},
		},
	};
};
