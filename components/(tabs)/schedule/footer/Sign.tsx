import { useThemeColor } from '@/hooks/colors/useThemeColor';
import * as React from 'react';
import Modal from 'react-native-modal';
import {
	useSignProfileScheduleMutation,
	useUserQuery,
} from '@/hooks/react-query/profile.hooks';
import Schedule from '@/models/Schedule.Model';
import {
	getDateString,
	getTimeString,
	moneyToString,
} from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from 'react-native';
import { DateTime } from 'luxon';
import Reservation from '@/models/Reservation.Model';
import { isHoliday } from '@/utils/date.utils';
import { useScheduleDate } from '@/context-providers/ScheduleDateContext';
import { ColouredButton } from '@/components/ColouredButton';

interface SignProp {
	isSigned: boolean;
}

const Sign: React.FC<SignProp> = ({ isSigned }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDate();

	const { data: user } = useUserQuery();
	const language = user?.language;

	const textColor = useThemeColor({}, 'text');

	const borderColor = useThemeColor({}, 'border');

	const blueColor = useThemeColor({}, 'blue');
	const grayColor = useThemeColor({}, 'gray');

	const modalBackgroundColor = useThemeColor({}, 'modalBackground');
	const modalTitleColor = useThemeColor({}, 'modalTitle');

	const [isModalVisible, setModalVisible] = React.useState(false);

	const dateString = getDateString(date.year, date.month, date.day, language);

	const toggleModal = () => setModalVisible(!isModalVisible);

	const signScheduleMutation = useSignProfileScheduleMutation({
		onSuccess: toggleModal,
		setLoading: () => {},
	});
	const onSign = () => {
		const signDate = DateTime.fromObject(
			{ ...date },
			{
				zone: 'America/Los_Angeles',
			}
		).startOf('day');

		signScheduleMutation.mutate({ date: signDate });
	};

	// const changePasswordMutation = useChangePasswordMutation({
	//     onSuccess: toggleModal,
	//     setLoading,
	// });
	// const onChangePassword = () => {
	//     const request: ChangeProfilePasswordRequest = {
	//         old_password: oldPassword,
	//         new_password: newPassword,
	//     };

	//     changePasswordMutation.mutate({ request });
	// };

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			<ColouredButton
				type={isSigned ? 'default' : 'add'}
				style={styles.button}
				disabled={isSigned}
				onPress={toggleModal}
			>
				<Text style={styles.buttonText}>
					{isSigned ? t('Signed') : t('Sign Off')}
				</Text>
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
					<Text
						adjustsFontSizeToFit
						numberOfLines={1}
						style={[styles.modalTitle, { color: modalTitleColor }]}
					>
						{t('Sign Schedule') + ': ' + dateString}
					</Text>

					<View style={styles.textInputContainer}>
						<Text style={{ color: textColor }}>
							{t('Sign Off Message', { date: dateString })}
						</Text>
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
									backgroundColor: blueColor,
								},
							]}
							onPress={onSign}
						>
							<Text style={styles.modalButtonText}>{t('Sign')}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 'auto',
		padding: 20,
		borderBottomWidth: 5,
		alignItems: 'center',
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
	btnContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
});

export default Sign;