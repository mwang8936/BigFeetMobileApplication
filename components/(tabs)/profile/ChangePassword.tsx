import React, { useRef, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import {
	useChangePasswordMutation,
	useUserQuery,
} from '@/hooks/react-query/profile.hooks';
import { getFullMonthString, getYearMonthString } from '@/utils/string.utils';
import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useTranslation } from 'react-i18next';
import { ColouredButton } from '@/components/ColouredButton';
import { ThemedTextInput } from '@/components/ThemedTextInput';
import { TextInput } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import LENGTHS from '@/constants/Lengths';
import PLACEHOLDERS from '@/constants/Placeholders';
import { ChangeProfilePasswordRequest } from '@/models/requests/Profile.Request.Model';
import { getDisabledColor } from '@/utils/color.utils';

interface ChangePasswordProp {
	setLoading(loading: boolean): void;
}

const ChangePassword: React.FC<ChangePasswordProp> = ({ setLoading }) => {
	const { t } = useTranslation();

	const blueColor = useThemeColor({}, 'blue');
	const grayColor = useThemeColor({}, 'gray');

	const modalBackgroundColor = useThemeColor({}, 'modalBackground');
	const modalTitleColor = useThemeColor({}, 'modalTitle');
	const modalLabelColor = useThemeColor({}, 'modalLabel');

	const [oldPassword, setOldPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [retypeNewPassword, setRetypeNewPassword] = useState('');

	const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false);
	const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
	const [isRetypeNewPasswordVisible, setIsRetypeNewPasswordVisible] =
		useState(false);

	const oldPasswordInputRef = useRef<TextInput>(null);
	const newPasswordInputRef = useRef<TextInput>(null);
	const retypeNewPasswordInputRef = useRef<TextInput>(null);

	const [isModalVisible, setModalVisible] = useState(false);

	const missingInput =
		oldPassword.length === 0 ||
		newPassword.length === 0 ||
		retypeNewPassword.length === 0;
	const matchingPasswords = newPassword === retypeNewPassword;

	const disableChangeBtn = missingInput || !matchingPasswords;

	const toggleModal = () => setModalVisible(!isModalVisible);

	const changePasswordMutation = useChangePasswordMutation({
		onSuccess: toggleModal,
		setLoading,
	});
	const onChangePassword = () => {
		const request: ChangeProfilePasswordRequest = {
			old_password: oldPassword,
			new_password: newPassword,
		};

		changePasswordMutation.mutate({ request });
	};

	return (
		<>
			<ColouredButton type="edit" style={styles.button} onPress={toggleModal}>
				<Text style={styles.buttonText}>{t('Change Password')}</Text>
			</ColouredButton>

			<Modal
				isVisible={isModalVisible}
				onBackdropPress={toggleModal}
				backdropOpacity={0.5}
				animationIn="slideInUp"
				animationOut="slideOutDown"
				style={styles.modal}
			>
				<View
					style={[
						styles.modalContent,
						{ backgroundColor: modalBackgroundColor },
					]}
				>
					<Text style={[styles.modalTitle, { color: modalTitleColor }]}>
						{t('Change Password')}
					</Text>

					<View style={styles.textInputContainer}>
						<View style={styles.textInputWrapper}>
							<Text style={[styles.textInputLabel, { color: modalLabelColor }]}>
								{t('Old Password')}
							</Text>

							<View style={styles.inputWrapper}>
								<ThemedTextInput
									ref={oldPasswordInputRef}
									type="mediumSemiBold"
									style={styles.textInput}
									placeholder={t(PLACEHOLDERS.login.password)}
									autoCorrect={false}
									autoComplete="password"
									maxLength={LENGTHS.login.password}
									textContentType="oneTimeCode" // Have to use this to stop keyboard flicker
									secureTextEntry={!isOldPasswordVisible}
									text={oldPassword}
									setText={setOldPassword}
									returnKeyType={'next'}
									onSubmitEditing={() => newPasswordInputRef?.current?.focus()}
								/>

								<TouchableOpacity
									onPress={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
									style={styles.iconContainer}
								>
									<Ionicons
										name={isOldPasswordVisible ? 'eye-off' : 'eye'}
										size={24}
										color="#848484"
									/>
								</TouchableOpacity>

								{oldPassword.length === 0 && (
									<Text style={styles.errorText}>{t('Missing Input')}</Text>
								)}
							</View>
						</View>

						<View style={[styles.textInputWrapper, { marginTop: 24 }]}>
							<Text style={[styles.textInputLabel, { color: modalLabelColor }]}>
								{t('New Password')}
							</Text>

							<View style={styles.inputWrapper}>
								<ThemedTextInput
									ref={newPasswordInputRef}
									type="mediumSemiBold"
									style={styles.textInput}
									placeholder={t(PLACEHOLDERS.login.password)}
									autoCorrect={false}
									autoComplete="password"
									maxLength={LENGTHS.login.password}
									textContentType="oneTimeCode" // Have to use this to stop keyboard flicker
									secureTextEntry={!isNewPasswordVisible}
									text={newPassword}
									setText={setNewPassword}
									returnKeyType={'next'}
									onSubmitEditing={() =>
										retypeNewPasswordInputRef?.current?.focus()
									}
								/>

								<TouchableOpacity
									onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
									style={styles.iconContainer}
								>
									<Ionicons
										name={isNewPasswordVisible ? 'eye-off' : 'eye'}
										size={24}
										color="#848484"
									/>
								</TouchableOpacity>

								{newPassword.length === 0 && (
									<Text style={styles.errorText}>{t('Missing Input')}</Text>
								)}
							</View>
						</View>

						<View style={styles.textInputWrapper}>
							<Text style={[styles.textInputLabel, { color: modalLabelColor }]}>
								{t('Retype New Password')}
							</Text>

							<View style={styles.inputWrapper}>
								<ThemedTextInput
									ref={retypeNewPasswordInputRef}
									type="mediumSemiBold"
									style={styles.textInput}
									placeholder={t(PLACEHOLDERS.login.password)}
									autoCorrect={false}
									autoComplete="password"
									maxLength={LENGTHS.login.password}
									textContentType="oneTimeCode" // Have to use this to stop keyboard flicker
									secureTextEntry={!isRetypeNewPasswordVisible}
									text={retypeNewPassword}
									setText={setRetypeNewPassword}
									returnKeyType={'next'}
									onSubmitEditing={() => oldPasswordInputRef?.current?.focus()}
								/>

								<TouchableOpacity
									onPress={() =>
										setIsRetypeNewPasswordVisible(!isRetypeNewPasswordVisible)
									}
									style={styles.iconContainer}
								>
									<Ionicons
										name={isRetypeNewPasswordVisible ? 'eye-off' : 'eye'}
										size={24}
										color="#848484"
									/>
								</TouchableOpacity>

								{retypeNewPassword.length === 0 ? (
									<Text style={styles.errorText}>{t('Missing Input')}</Text>
								) : (
									!matchingPasswords && (
										<Text style={styles.errorText}>
											{t('Passwords must match')}
										</Text>
									)
								)}
							</View>
						</View>
					</View>

					<View style={styles.btnContainer}>
						<TouchableOpacity
							style={[styles.modalButton, { backgroundColor: grayColor }]}
							onPress={toggleModal}
						>
							<Text style={styles.modalButtonText}>{t('Cancel')}</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.modalButton,
								{
									backgroundColor: disableChangeBtn
										? getDisabledColor(blueColor)
										: blueColor,
								},
							]}
							onPress={onChangePassword}
							disabled={disableChangeBtn}
						>
							<Text style={styles.modalButtonText}>{t('Change')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</>
	);
};

const styles = StyleSheet.create({
	button: {
		width: '80%',
		marginVertical: 16,
		borderRadius: 24,
	},
	buttonText: {
		color: '#fff',
		fontSize: 24,
		paddingVertical: 12,
		fontWeight: '600',
	},
	text: {
		fontSize: 18,
		marginBottom: 20,
		fontWeight: 'bold',
	},
	errorText: {
		color: 'red',
		fontSize: 12,
		fontStyle: 'italic',
		marginTop: 4,
	},
	modalButton: {
		marginHorizontal: 20,
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 8,
	},
	modalButtonText: {
		color: '#ECEDEE',
		fontSize: 16,
		fontWeight: 'bold',
	},
	modal: {
		justifyContent: 'center',
		margin: 0,
	},
	modalContent: {
		borderRadius: 20,
		padding: 20,
		marginHorizontal: 20,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	textInputContainer: {
		flexDirection: 'column',
		width: '100%',
		height: 'auto',
		marginBottom: 20,
	},
	textInputWrapper: {
		alignItems: 'center',
	},
	textInputLabel: {
		fontSize: 16,
		marginBottom: 10,
	},
	inputWrapper: { width: '80%', marginBottom: 24 },
	textInput: {
		marginTop: 8,
	},
	iconContainer: {
		position: 'absolute',
		padding: 8,
		right: 4,
		top: '20%',
	},
	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default ChangePassword;
