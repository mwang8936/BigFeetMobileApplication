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
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { router } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import { useSession } from '@/context-providers/AuthContext';
import { ColouredButton } from '@/components/ColouredButton';
import { ThemedLoadingSpinner } from '@/components/ThemedLoadingSpinner';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { ThemedView } from '@/components/ThemedView';

import LENGTHS from '@/constants/Lengths';
import PLACEHOLDERS from '@/constants/Placeholders';

export default function LoginScreen() {
	const { signIn } = useSession();

	const colorScheme = useColorScheme();
	const { t } = useTranslation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const [isLoading, setIsLoading] = useState(false);

	const [usernameInvalid, setUsernameInvalid] = useState(false);

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const usernameInputRef = useRef<TextInput>(null);
	const passwordInputRef = useRef<TextInput>(null);

	const missingInput = username.length === 0 || password.length === 0;
	const invalidInput = usernameInvalid || missingInput;

	const handleLogin = async () => {
		setIsLoading(true);

		try {
			await signIn({ username, password });
			router.replace('/');
		} catch (error) {
			console.error('Login Failed:', error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<TouchableWithoutFeedback
			style={{ height: '100%' }}
			accessible={false}
			onPress={Keyboard.dismiss}
		>
			<SafeAreaProvider>
				<SafeAreaView style={{ flex: 1 }} edges={['top']}>
					<KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					>
						<ThemedView style={styles.container}>
							<ThemedLoadingSpinner
								indicator="ball"
								isLoading={isLoading}
								message={t('Logging In...')}
							/>

							<Image
								source={require('../assets/images/logo.png')}
								style={{ resizeMode: 'center' }}
							/>

							<View style={{ width: '80%', marginBottom: 16 }}>
								<ThemedText type="subtitle">{t('Username')}</ThemedText>

								<ThemedTextInput
									ref={usernameInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8 }}
									placeholder={t(PLACEHOLDERS.login.username)}
									autoCorrect={false}
									autoComplete="username"
									maxLength={LENGTHS.login.username}
									textContentType="oneTimeCode" // Have to use this to stop keyboard flicker
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
								<ThemedText type="subtitle">{t('Password')}</ThemedText>

								<ThemedTextInput
									ref={passwordInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8 }}
									placeholder={t(PLACEHOLDERS.login.password)}
									autoCorrect={false}
									autoComplete="password"
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
									style={styles.iconContainer}
								>
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
								disabled={invalidInput}
								onPress={handleLogin}
							>
								<Text
									style={[
										styles.buttonText,
										{ color: colorScheme === 'dark' ? '#000' : '#fff' },
									]}
								>
									{t('Login')}
								</Text>
							</ColouredButton>
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
