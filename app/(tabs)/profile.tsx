import { useEffect, useRef, useState } from 'react';
import {
	StyleSheet,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	View,
	RefreshControl,
	TextInput,
	Text,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import { useSession } from '@/context-providers/AuthContext';

import ChangePassword from '@/components/(tabs)/profile/ChangePassword';
import { ColouredButton } from '@/components/ColouredButton';
import { ThemedDropdown } from '@/components/ThemedDropdown';
import { ThemedLoadingSpinner } from '@/components/ThemedLoadingSpinner';
import { ThemedText } from '@/components/ThemedText';
import { ThemedTextInput } from '@/components/ThemedTextInput';

import {
	genderDropDownItems,
	languageDropDownItems,
	roleDropDownItems,
} from '@/constants/Dropdowns';
import LENGTHS from '@/constants/Lengths';
import PLACEHOLDERS from '@/constants/Placeholders';
import { profileQueryKey, userQueryKey } from '@/constants/Query';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import {
	useUpdateUserLanguageMutation,
	useUserQuery,
} from '@/hooks/react-query/profile.hooks';
import { useToast } from '@/hooks/toast/useToast';

import { UpdateProfileRequest } from '@/models/requests/Profile.Request.Model';
import { Gender, Language, Role } from '@/models/enums';

export default function ProfileScreen() {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { signOut } = useSession();

	const textColor = useThemeColor({}, 'text');
	const { showErrorToast } = useToast();

	const { data: user, isError } = useUserQuery({});

	if (isError) {
		showErrorToast(t('Error Getting Profile'));
	}

	const isFetching = useIsFetching({
		queryKey: [userQueryKey, profileQueryKey],
	});
	const onRefresh = async () => {
		queryClient.refetchQueries({
			queryKey: [userQueryKey, profileQueryKey],
		});
	};

	useEffect(() => {
		if (user) {
			setUsername(user.username);
			setFirstName(user.first_name);
			setLastName(user.last_name);
			setGender(user.gender);
			setRole(user.role);
			setBodyRateString(user.body_rate?.toFixed(2) ?? '');
			setFeetRateString(user.feet_rate?.toFixed(2) ?? '');
			setAcupunctureRateString(user.acupuncture_rate?.toFixed(2) ?? '');
			setHourlyRateString(user.per_hour?.toFixed(2) ?? '');
			setLanguage(user.language);
		}
	}, [user]);

	const [isLoading, setIsLoading] = useState(false);

	const [username, setUsername] = useState(user?.username ?? '');
	const [firstName, setFirstName] = useState(user?.first_name ?? '');
	const [lastName, setLastName] = useState(user?.last_name ?? '');

	const [gender, setGender] = useState<Gender | null>(user?.gender ?? null);
	const [role, setRole] = useState<Role | null>(user?.role ?? null);

	const [bodyRateString, setBodyRateString] = useState(
		user?.body_rate?.toFixed(2) ?? ''
	);
	// const bodyRate = convertStringToFloat(bodyRateString);

	const [feetRateString, setFeetRateString] = useState(
		user?.feet_rate?.toFixed(2) ?? ''
	);
	// const feetRate = convertStringToFloat(feetRateString);

	const [acupunctureRateString, setAcupunctureRateString] = useState(
		user?.acupuncture_rate?.toFixed(2) ?? ''
	);
	// const acupunctureRate = convertStringToFloat(acupunctureRateString);

	const [hourlyRateString, setHourlyRateString] = useState(
		user?.per_hour?.toFixed(2) ?? ''
	);
	// const hourlyRate = convertStringToFloat(hourlyRateString);

	const [language, setLanguage] = useState<Language | null>(
		user?.language ?? null
	);

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

	// TODO: Add in later when we add the ability to update users for people with permissions
	// const missingInput =
	// 	username.length === 0 ||
	// 	firstName.length === 0 ||
	// 	lastName.length === 0 ||
	// 	gender === null ||
	// 	role === null ||
	// 	language === null;

	// const changesMade =
	// 	user?.username !== username ||
	// 	user?.first_name !== firstName ||
	// 	user?.last_name !== lastName ||
	// 	user?.gender !== gender ||
	// 	user?.role !== role ||
	// 	user?.body_rate !== bodyRate ||
	// 	user?.feet_rate !== feetRate ||
	// 	user?.acupuncture_rate !== acupunctureRate ||
	// 	user?.per_hour !== hourlyRate ||
	// 	user?.language !== language;

	// const invalidInput =
	// 	usernameInvalid ||
	// 	firstNameInvalid ||
	// 	lastNameInvalid ||
	// 	bodyRateInvalid ||
	// 	feetRateInvalid ||
	// 	acupunctureRateInvalid ||
	// 	hourlyRateInvalid;

	const editable = false;
	// user?.permissions?.includes(
	// 	Permissions.PERMISSION_UPDATE_EMPLOYEE
	// );

	// const disableEditButton =
	// 	!editable || missingInput || !changesMade || invalidInput;

	const updateLanguageMutation = useUpdateUserLanguageMutation({
		setLoading: setIsLoading,
	});
	const onLanguageChange = async (updatedLanguage: Language | null) => {
		if (updatedLanguage === null || language === updatedLanguage) return;

		const request: UpdateProfileRequest = {
			language: updatedLanguage,
		};
		updateLanguageMutation.mutate({ request });
	};

	const handleLogout = () => {
		try {
			signOut();
		} catch (error) {
			console.error('Login Failed:', error);
		}
	};

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				<KeyboardAvoidingView
					style={styles.container}
					behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
					keyboardVerticalOffset={100}
				>
					<ThemedLoadingSpinner
						indicator="ball"
						isLoading={isLoading}
						message={t('Updating Profile...')}
					/>

					<ScrollView
						style={styles.container}
						contentContainerStyle={styles.scrollViewContent}
						refreshControl={
							<RefreshControl
								refreshing={Boolean(isFetching)}
								onRefresh={onRefresh}
							/>
						}
					>
						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Username')}</ThemedText>

							<ThemedTextInput
								type="mediumSemiBold"
								style={styles.textInput}
								placeholder={t(PLACEHOLDERS.employee.username)}
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
									{t('Invalid Input: Missing Required Input')}
								</Text>
							) : (
								usernameInvalid && (
									<Text style={styles.errorText}>{t('Invalid Input')}</Text>
								)
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('First Name')}</ThemedText>

							<ThemedTextInput
								ref={firstNameInputRef}
								type="mediumSemiBold"
								style={styles.textInput}
								placeholder={t(PLACEHOLDERS.employee.first_name)}
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
									{t('Invalid Input: Missing Required Input')}
								</Text>
							) : (
								firstNameInvalid && (
									<Text style={styles.errorText}>{t('Invalid Input')}</Text>
								)
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Last Name')}</ThemedText>

							<ThemedTextInput
								ref={lastNameInputRef}
								type="mediumSemiBold"
								style={styles.textInput}
								placeholder={t(PLACEHOLDERS.employee.last_name)}
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
									{t('Invalid Input: Missing Required Input')}
								</Text>
							) : (
								lastNameInvalid && (
									<Text style={styles.errorText}>{t('Invalid Input')}</Text>
								)
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Gender')}</ThemedText>

							<ThemedDropdown
								type="mediumSemiBold"
								style={styles.textInput}
								data={genderDropDownItems.map((option) => ({
									value: option.value,
									label: t(option.label),
									icon: option.icon,
								}))}
								option={genderOption}
								onChange={(option) => {
									setGender(option.value as Gender | null);
									bodyRateInputRef?.current?.focus();
								}}
								placeholderText={t(PLACEHOLDERS.employee.gender)}
								required={true}
								disable={!editable}
								labelField={'label'}
								valueField={'value'}
								iconName={'male-female-sharp'}
							/>

							{gender === null && (
								<Text style={styles.errorText}>
									{t('Invalid Input: Missing Required Input')}
								</Text>
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Role')}</ThemedText>

							<ThemedDropdown
								type="mediumSemiBold"
								style={styles.textInput}
								data={roleDropDownItems.map((option) => ({
									value: option.value,
									label: t(option.label),
									icon: option.icon,
								}))}
								option={roleOption}
								onChange={(option) => {
									setRole(option.value as Role | null);
								}}
								placeholderText={t(PLACEHOLDERS.employee.role)}
								required={true}
								disable={true}
								labelField={'label'}
								valueField={'value'}
								iconName={'person-sharp'}
							/>

							{role === null && (
								<Text style={styles.errorText}>
									{t('Invalid Input: Missing Required Input')}
								</Text>
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Body Rate')}</ThemedText>

							<View>
								<Text style={[styles.textInputSymbol, { color: textColor }]}>
									$
								</Text>

								<ThemedTextInput
									ref={bodyRateInputRef}
									type="mediumSemiBold"
									style={[styles.textInput, styles.textInputPadding]}
									placeholder={t(PLACEHOLDERS.employee.body_rate)}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.body_rate}
									text={bodyRateString}
									setText={setBodyRateString}
									invalid={bodyRateInvalid}
									setInvalid={setBodyRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
									onSubmitEditing={() => feetRateInputRef?.current?.focus()}
								/>

								<Text style={[styles.textInputSymbolEnd, { color: textColor }]}>
									/ B
								</Text>
							</View>

							{bodyRateInvalid && (
								<Text style={styles.errorText}>{t('Invalid Input')}</Text>
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Feet Rate')}</ThemedText>

							<View>
								<Text style={[styles.textInputSymbol, { color: textColor }]}>
									$
								</Text>

								<ThemedTextInput
									ref={feetRateInputRef}
									type="mediumSemiBold"
									style={[styles.textInput, styles.textInputPadding]}
									placeholder={t(PLACEHOLDERS.employee.feet_rate)}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.feet_rate}
									text={feetRateString}
									setText={setFeetRateString}
									invalid={feetRateInvalid}
									setInvalid={setFeetRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
									onSubmitEditing={() =>
										acupunctureRateInputRef?.current?.focus()
									}
								/>

								<Text style={[styles.textInputSymbolEnd, { color: textColor }]}>
									/ F
								</Text>
							</View>

							{feetRateInvalid && (
								<Text style={styles.errorText}>{t('Invalid Input')}</Text>
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Acupuncture Rate')}</ThemedText>

							<View>
								<Text style={[styles.textInputSymbol, { color: textColor }]}>
									$
								</Text>

								<ThemedTextInput
									ref={acupunctureRateInputRef}
									type="mediumSemiBold"
									style={[styles.textInput, styles.textInputPadding]}
									placeholder={t(PLACEHOLDERS.employee.acupuncture_rate)}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.acupuncture_rate}
									text={acupunctureRateString}
									setText={setAcupunctureRateString}
									invalid={acupunctureRateInvalid}
									setInvalid={setAcupunctureRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
									onSubmitEditing={() => hourlyRateInputRef?.current?.focus()}
								/>

								<Text style={[styles.textInputSymbolEnd, { color: textColor }]}>
									/ A
								</Text>
							</View>

							{acupunctureRateInvalid && (
								<Text style={styles.errorText}>{t('Invalid Input')}</Text>
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Hourly Rate')}</ThemedText>

							<View>
								<Text style={[styles.textInputSymbol, { color: textColor }]}>
									$
								</Text>

								<ThemedTextInput
									ref={hourlyRateInputRef}
									type="mediumSemiBold"
									style={[styles.textInput, styles.textInputPadding]}
									placeholder={t(PLACEHOLDERS.employee.per_hour)}
									textContentType="none"
									autoComplete="off"
									keyboardType="decimal-pad"
									maxLength={LENGTHS.employee.per_hour}
									text={hourlyRateString}
									setText={setHourlyRateString}
									invalid={hourlyRateInvalid}
									setInvalid={setHourlyRateInvalid}
									pattern={/^(?:\d{1,2}|\d{0,2}\.\d{1,2})?$/}
									editable={editable}
									returnKeyType="next"
								/>

								<Text style={[styles.textInputSymbolEnd, { color: textColor }]}>
									/ hr
								</Text>
							</View>

							{hourlyRateInvalid && (
								<Text style={styles.errorText}>{t('Invalid Input')}</Text>
							)}
						</View>

						<View style={styles.textInputView}>
							<ThemedText type="subtitle">{t('Language')}</ThemedText>

							<ThemedDropdown
								type="mediumSemiBold"
								style={styles.textInput}
								data={languageDropDownItems}
								option={languageOption}
								onChange={(option) =>
									onLanguageChange(option.value as Language | null)
								}
								placeholderText={t(PLACEHOLDERS.employee.language)}
								required={true}
								disable={false}
								labelField={'label'}
								valueField={'value'}
								iconName={'language-sharp'}
							/>

							{language === null && (
								<Text style={styles.errorText}>
									{t('Invalid Input: Missing Required Input')}
								</Text>
							)}
						</View>

						<ChangePassword setLoading={setIsLoading} />

						<ColouredButton
							type="default"
							style={styles.button}
							onPress={handleLogout}
						>
							<Text style={styles.buttonText}>{t('Logout')}</Text>
						</ColouredButton>
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
	textInputView: {
		width: '80%',
		marginBottom: 16,
	},
	textInput: {
		marginTop: 8,
	},
	textInputPadding: {
		paddingLeft: 24,
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		fontStyle: 'italic',
		marginTop: 4,
	},
	textInputSymbol: {
		position: 'absolute',
		zIndex: 1,
		fontSize: 24,
		fontWeight: 600,
		padding: 8,
		left: 4,
		top: '18%',
	},
	textInputSymbolEnd: {
		position: 'absolute',
		fontSize: 24,
		fontWeight: 600,
		padding: 8,
		right: 4,
		top: '18%',
	},
	button: {
		width: '80%',
		marginTop: 16,
		borderRadius: 24,
	},
	buttonText: {
		color: '#fff',
		fontSize: 24,
		paddingVertical: 12,
		fontWeight: '600',
	},
});
