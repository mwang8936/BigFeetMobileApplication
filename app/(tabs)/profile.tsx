import { useRef, useState } from 'react';
import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
	TextInput,
	Text,
	useColorScheme,
	ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

import { ColouredButton } from '@/components/ColouredButton';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';

import { Gender, Language, Role } from '@/models/enums';
import {
	genderDropDownItems,
	languageDropDownItems,
	roleDropDownItems,
} from '@/constants/Dropdowns';
import PLACEHOLDERS from '@/constants/Placeholders';
import LENGTHS from '@/constants/Lengths';

export default function ProfileScreen() {
	const router = useRouter();

	const colorScheme = useColorScheme();

	const [loading, setLoading] = useState(false);

	const [changePasswordModalVisible, setChangePasswordModalVisible] =
		useState(false);

	const [username, setUsername] = useState('WGong');
	const [firstName, setFirstName] = useState('William');
	const [lastName, setLastName] = useState('Gong');
	const [gender, setGender] = useState<Gender | null>(Gender.MALE);
	const [role, setRole] = useState<Role | null>(Role.DEVELOPER);
	const [bodyRate, setBodyRate] = useState('12.34');
	const [feetRate, setFeetRate] = useState('23.34');
	const [acupunctureRate, setAcupunctureRate] = useState('');
	const [hourlyRate, setHourlyRate] = useState('0');
	const [language, setLanguage] = useState<Language | null>(Language.ENGLISH);

	const [usernameInvalid, setUsernameInvalid] = useState(false);
	const [firstNameInvalid, setFirstNameInvalid] = useState(false);
	const [lastNameInvalid, setLastNameInvalid] = useState(false);
	const [bodyRateInvalid, setBodyRateInvalid] = useState(false);
	const [feetRateInvalid, setFeetRateInvalid] = useState(false);
	const [acupunctureRateInvalid, setAcupunctureRateInvalid] = useState(false);
	const [hourlyRateInvalid, setHourlyRateInvalid] = useState(false);

	const firstNameInputRef = useRef<TextInput>(null);
	const lastNameInputRef = useRef<TextInput>(null);
	const bodyRateInputRef = useRef<TextInput>(null);
	const feetRateInputRef = useRef<TextInput>(null);
	const acupunctureRateInputRef = useRef<TextInput>(null);
	const hourlyRateInputRef = useRef<TextInput>(null);

	const genderOption =
		genderDropDownItems.find(
			(genderDropDownItem) => genderDropDownItem.value === gender
		) || genderDropDownItems[0];
	const roleOption =
		roleDropDownItems.find(
			(roleDropDownItem) => roleDropDownItem.value === role
		) || roleDropDownItems[0];
	const languageOption =
		languageDropDownItems.find(
			(languageDropDownItems) => languageDropDownItems.value === language
		) || languageDropDownItems[0];

	const missingInput =
		username.length === 0 ||
		firstName.length === 0 ||
		lastName.length === 0 ||
		gender === null ||
		role === null ||
		language === null;

	const invalidInput =
		usernameInvalid ||
		firstNameInvalid ||
		lastNameInvalid ||
		bodyRateInvalid ||
		feetRateInvalid ||
		acupunctureRateInvalid ||
		hourlyRateInvalid;

	const editable = true;

	const disableEditButton = !editable || missingInput || invalidInput;

	const showToast = (type: 'success' | 'error') => {
		Toast.show({
			type,
			text1:
				type === 'success' ? 'Profile Updated' : 'Failed to Update Profile',
			text2: type === 'error' ? 'Placeholder message' : undefined,
		});
	};

	const handleLogout = () => {
		setLoading(true);
		const checkAuthStatus = async () => {
			// Simulate async auth check
			setTimeout(() => {
				// Set `isAuthenticated` to true if user is logged in
				setLoading(false);
				showToast('success');
				// router.replace('/login');
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
		<SafeAreaProvider>
			<SafeAreaView style={{ flex: 1 }} edges={['top']}>
				<KeyboardAvoidingView
					style={{ flex: 1 }}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={100}>
					<ScrollView
						style={{ flex: 1 }}
						contentContainerStyle={styles.scrollViewContent}>
						<ColouredButton
							type="edit"
							style={{
								width: '80%',
								marginVertical: 16,
								borderRadius: 24,
							}}
							onPress={() => setChangePasswordModalVisible(true)}>
							<Text style={[styles.buttonText]}>Change Password</Text>
						</ColouredButton>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Username</ThemedText>

							<ThemedTextInput
								type="mediumSemiBold"
								style={{ marginTop: 8 }}
								placeholder={PLACEHOLDERS.employee.username}
								textContentType="name"
								autoCapitalize="words"
								autoComplete="username"
								autoCorrect={false}
								maxLength={LENGTHS.employee.username}
								text={username}
								setText={setUsername}
								invalid={usernameInvalid}
								setInvalid={setUsernameInvalid}
								pattern={/^[a-zA-Z0-9.]+$/}
								editable={editable}
								required={true}
								returnKeyType="next"
								onSubmitEditing={() => firstNameInputRef?.current?.focus()}
							/>

							{username.length === 0 ? (
								<Text style={styles.errorText}>
									Invalid Input: Missing Required Input
								</Text>
							) : (
								usernameInvalid && (
									<Text style={styles.errorText}>Invalid Input</Text>
								)
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">First Name</ThemedText>

							<ThemedTextInput
								ref={firstNameInputRef}
								type="mediumSemiBold"
								style={{ marginTop: 8 }}
								placeholder={PLACEHOLDERS.employee.first_name}
								textContentType="givenName"
								autoCapitalize="words"
								autoComplete="given-name"
								autoCorrect={false}
								maxLength={LENGTHS.employee.first_name}
								text={firstName}
								setText={setFirstName}
								invalid={firstNameInvalid}
								setInvalid={setFirstNameInvalid}
								pattern={/^[A-Za-z][A-Za-z\s'–-]*$/}
								editable={editable}
								required={true}
								returnKeyType="next"
								onSubmitEditing={() => lastNameInputRef?.current?.focus()}
							/>

							{firstName.length === 0 ? (
								<Text style={styles.errorText}>
									Invalid Input: Missing Required Input
								</Text>
							) : (
								firstNameInvalid && (
									<Text style={styles.errorText}>Invalid Input</Text>
								)
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Last Name</ThemedText>

							<ThemedTextInput
								ref={lastNameInputRef}
								type="mediumSemiBold"
								style={{ marginTop: 8 }}
								placeholder={PLACEHOLDERS.employee.last_name}
								textContentType="familyName"
								autoCapitalize="words"
								autoComplete="family-name"
								autoCorrect={false}
								maxLength={LENGTHS.employee.last_name}
								text={lastName}
								setText={setLastName}
								invalid={lastNameInvalid}
								setInvalid={setLastNameInvalid}
								pattern={/^[A-Za-z][A-Za-z\s'–-]*$/}
								editable={editable}
								required={true}
								returnKeyType="next"
								onSubmitEditing={() => bodyRateInputRef?.current?.focus()}
							/>

							{lastName.length === 0 ? (
								<Text style={styles.errorText}>
									Invalid Input: Missing Required Input
								</Text>
							) : (
								lastNameInvalid && (
									<Text style={styles.errorText}>Invalid Input</Text>
								)
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Gender</ThemedText>

							<ThemedDropdown
								type="mediumSemiBold"
								style={{ marginTop: 8 }}
								data={genderDropDownItems}
								option={genderOption}
								onChange={(option) => {
									setGender(option.value as Gender | null);
									bodyRateInputRef?.current?.focus();
								}}
								placeholderText={PLACEHOLDERS.employee.gender}
								required={true}
								disable={!editable}
								labelField={'label'}
								valueField={'value'}
								iconName={'male-female-sharp'}
							/>

							{gender === null && (
								<Text style={styles.errorText}>
									Invalid Input: Missing Required Input
								</Text>
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Role</ThemedText>

							<ThemedDropdown
								type="mediumSemiBold"
								style={{ marginTop: 8 }}
								data={roleDropDownItems}
								option={roleOption}
								onChange={(option) => {
									setRole(option.value as Role | null);
								}}
								placeholderText={PLACEHOLDERS.employee.role}
								required={true}
								disable={true}
								labelField={'label'}
								valueField={'value'}
								iconName={'person-sharp'}
							/>

							{role === null && (
								<Text style={styles.errorText}>
									Invalid Input: Missing Required Input
								</Text>
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Body Rate</ThemedText>

							<View>
								<Text
									style={[
										styles.textInputSymbol,
										{ color: colorScheme === 'dark' ? '#fff' : '#000' },
									]}>
									$
								</Text>

								<ThemedTextInput
									ref={bodyRateInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8, paddingLeft: 24 }}
									placeholder={PLACEHOLDERS.employee.body_rate}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.body_rate}
									text={bodyRate}
									setText={setBodyRate}
									invalid={bodyRateInvalid}
									setInvalid={setBodyRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
									onSubmitEditing={() => feetRateInputRef?.current?.focus()}
								/>
							</View>

							{bodyRateInvalid && (
								<Text style={styles.errorText}>Invalid Input</Text>
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Feet Rate</ThemedText>

							<View>
								<Text
									style={[
										styles.textInputSymbol,
										{ color: colorScheme === 'dark' ? '#fff' : '#000' },
									]}>
									$
								</Text>

								<ThemedTextInput
									ref={feetRateInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8, paddingLeft: 24 }}
									placeholder={PLACEHOLDERS.employee.feet_rate}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.feet_rate}
									text={feetRate}
									setText={setFeetRate}
									invalid={feetRateInvalid}
									setInvalid={setFeetRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
									onSubmitEditing={() =>
										acupunctureRateInputRef?.current?.focus()
									}
								/>
							</View>

							{feetRateInvalid && (
								<Text style={styles.errorText}>Invalid Input</Text>
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Acupuncture Rate</ThemedText>

							<View>
								<Text
									style={[
										styles.textInputSymbol,
										{ color: colorScheme === 'dark' ? '#fff' : '#000' },
									]}>
									$
								</Text>

								<ThemedTextInput
									ref={acupunctureRateInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8, paddingLeft: 24 }}
									placeholder={PLACEHOLDERS.employee.acupuncture_rate}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.acupuncture_rate}
									text={acupunctureRate}
									setText={setAcupunctureRate}
									invalid={acupunctureRateInvalid}
									setInvalid={setAcupunctureRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
									onSubmitEditing={() => hourlyRateInputRef?.current?.focus()}
								/>
							</View>

							{acupunctureRateInvalid && (
								<Text style={styles.errorText}>Invalid Input</Text>
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Hourly Rate</ThemedText>

							<View>
								<Text
									style={[
										styles.textInputSymbol,
										{ color: colorScheme === 'dark' ? '#fff' : '#000' },
									]}>
									$
								</Text>

								<ThemedTextInput
									ref={hourlyRateInputRef}
									type="mediumSemiBold"
									style={{ marginTop: 8, paddingLeft: 24 }}
									placeholder={PLACEHOLDERS.employee.per_hour}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.per_hour}
									text={hourlyRate}
									setText={setHourlyRate}
									invalid={hourlyRateInvalid}
									setInvalid={setHourlyRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
								/>
							</View>

							{hourlyRateInvalid && (
								<Text style={styles.errorText}>Invalid Input</Text>
							)}
						</View>

						<View style={{ width: '80%', marginBottom: 16 }}>
							<ThemedText type="subtitle">Language</ThemedText>

							<ThemedDropdown
								type="mediumSemiBold"
								style={{ marginTop: 8 }}
								data={languageDropDownItems}
								option={languageOption}
								onChange={(option) => {
									setLanguage(option.value as Language | null);
								}}
								placeholderText={PLACEHOLDERS.employee.language}
								required={true}
								disable={!editable}
								labelField={'label'}
								valueField={'value'}
								iconName={'language-sharp'}
							/>

							{language === null && (
								<Text style={styles.errorText}>
									Invalid Input: Missing Required Input
								</Text>
							)}
						</View>

						{editable && (
							<ColouredButton
								type="edit"
								style={{
									width: '80%',
									marginTop: 16,
									borderRadius: 24,
								}}
								disabled={disableEditButton}
								onPress={handleLogout}>
								<Text style={[styles.buttonText]}>Update Profile</Text>
							</ColouredButton>
						)}

						<ColouredButton
							type="default"
							style={{
								width: '80%',
								marginTop: 16,
								borderRadius: 24,
							}}
							onPress={handleLogout}>
							<Text style={[styles.buttonText]}>Logout</Text>
						</ColouredButton>

						<Toast />
					</ScrollView>
				</KeyboardAvoidingView>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 20,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		fontStyle: 'italic',
		marginTop: 4,
	},
	textInputSymbol: {
		position: 'absolute',
		fontSize: 24,
		fontWeight: 600,
		padding: 8,
		left: 4,
		top: '18%',
	},
	buttonText: {
		color: '#fff',
		fontSize: 24,
		paddingVertical: 12,
		fontWeight: '600',
	},
});
