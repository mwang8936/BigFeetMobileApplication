import React, { useRef, useState } from 'react';
import {
	View,
	Text,
	Keyboard,
	TouchableOpacity,
	StyleSheet,
	TouchableWithoutFeedback,
	Image,
	KeyboardAvoidingView,
	Platform,
	TextInput,
	useColorScheme,
	ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { ColouredButton } from '@/components/ColouredButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';

import LENGTHS from '@/constants/Lengths';
import PLACEHOLDERS from '@/constants/Placeholders';

export default function LoginScreen() {
	const router = useRouter();

	const colorScheme = useColorScheme();

	const [loading, setLoading] = useState(false);

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [usernameInvalid, setUsernameInvalid] = useState(false);

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const usernameInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const missingInput = username.length === 0 || password.length === 0;
	const invalidInput = usernameInvalid || missingInput;

	const showToast = () => {
		Toast.show({
			type: 'error',
			text1: 'Login Failed',
			text2: 'Could not find username',
		});
	};

	const handleLogin = () => {
		setLoading(true);
		const checkAuthStatus = async () => {
			// Simulate async auth check
			setTimeout(() => {
				// Set `isAuthenticated` to true if user is logged in
				setLoading(false);
				showToast();
				router.replace('/(tabs)');
			}, 2000);
		};

		checkAuthStatus();
	};

	if (loading) {
		return (
			<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
				<ActivityIndicator size="large" color="#0000ff" />
			</View>
		);
	}

	return (
		<TouchableWithoutFeedback
			style={{ height: '100%' }}
			accessible={false}
			onPress={Keyboard.dismiss}>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }} edges={['top']}>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
						<ThemedView style={styles.container}>
							<Image
								source={require('../assets/images/logo.png')}
								style={{ resizeMode: 'center' }}
							/>

							<View style={{ width: '80%', marginBottom: 16 }}>
								<ThemedText type="subtitle">Username</ThemedText>

								<ThemedTextInput
									ref={usernameInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8 }}
									placeholder={PLACEHOLDERS.login.username}
									textContentType="oneTimeCode" // Have to use this to stop keyboard flicker
									maxLength={LENGTHS.login.username}
									text={username}
									setText={setUsername}
									invalid={usernameInvalid}
									setInvalid={setUsernameInvalid}
									pattern={/^[a-zA-Z0-9.]*$/}
									returnKeyType={'next'}
									onSubmitEditing={() => {
										if (invalidInput) {
											passwordInputRef?.current?.focus();
										} else {
											handleLogin();
										}
									}}
								/>
							</View>

							<View style={{ width: '80%', marginVertical: 8 }}>
								<ThemedText type="subtitle">Password</ThemedText>

								<ThemedTextInput
									ref={passwordInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8 }}
									placeholder={PLACEHOLDERS.login.password}
									maxLength={LENGTHS.login.password}
									textContentType="oneTimeCode" // Have to use this to stop keyboard flicker
									secureTextEntry={!isPasswordVisible}
									text={password}
									setText={setPassword}
									returnKeyType={'next'}
									onSubmitEditing={() => {
										if (invalidInput) {
											usernameInputRef?.current?.focus();
										} else {
											handleLogin();
										}
									}}
								/>

								<TouchableOpacity
									onPress={() => setIsPasswordVisible(!isPasswordVisible)}
									style={styles.iconContainer}>
									<Ionicons
										name={isPasswordVisible ? 'eye-off' : 'eye'}
										size={24}
										color="#848484"
									/>
								</TouchableOpacity>
							</View>

							<ColouredButton
								type="default"
								style={{
									width: '80%',
									marginTop: 16,
									backgroundColor: !invalidInput
										? colorScheme === 'dark'
											? '#fff'
											: '#32CD32'
										: colorScheme === 'dark'
										? '#666' // Dark mode disabled color
										: '#a9a9a9', // Light mode disabled color
								}}
								disabled={missingInput}
								onPress={handleLogin}>
								<Text
									style={[
										styles.buttonText,
										{ color: colorScheme === 'dark' ? '#000' : '#fff' },
									]}>
									Login
								</Text>
							</ColouredButton>

							<Toast />
						</ThemedView>
					</KeyboardAvoidingView>
				</SafeAreaView>
			</SafeAreaProvider>
		</TouchableWithoutFeedback>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	iconContainer: {
		position: 'absolute',
		padding: 8,
		right: 4,
		top: '45%',
	},
	buttonText: {
		fontSize: 32,
		paddingVertical: 12,
		fontWeight: '600',
	},
});
