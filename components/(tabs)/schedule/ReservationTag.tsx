import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { DateTime } from 'luxon';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

import STORES from '@/constants/Stores';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';

import { ServiceColor, TipMethod } from '@/models/enums';
import Reservation from '@/models/Reservation.Model';

import {
	formatPhoneNumber,
	getTimeString,
	moneyToString,
} from '@/utils/string.utils';

interface ReservationTagProp {
	reservation: Reservation;
	itemHeight: number;
	offset: number;
}

const ReservationTag: React.FC<ReservationTagProp> = ({
	reservation,
	itemHeight,
	offset,
}) => {
	const { t } = useTranslation();

	const { data: user } = useUserQuery({});

	const blue = useThemeColor({}, 'blue');
	const green = useThemeColor({}, 'green');
	const red = useThemeColor({}, 'red');

	const borderColor = useThemeColor({}, 'border');

	const greenColor = useThemeColor({}, 'green');

	const modalBackgroundColor = useThemeColor({}, 'modalBackground');
	const modalTitleColor = useThemeColor({}, 'modalTitle');
	const modalLabelColor = useThemeColor({}, 'modalLabel');
	const textColor = useThemeColor({}, 'text');

	const [isModalVisible, setModalVisible] = React.useState(false);

	const service = reservation.service;
	const customer = reservation.customer;

	const reservationStart = reservation.reserved_date.setZone(
		'America/Los_Angeles'
	);
	const reservationDuration = reservation.time ?? service.time;
	const reservationEnd = reservationStart.plus({
		minutes: reservationDuration,
	});

	const colourMap = new Map([
		[ServiceColor.RED, { backgroundColor: '#DC2626', borderColor: '#B91C1C' }],
		[ServiceColor.BLUE, { backgroundColor: '#2563EB', borderColor: '#1D4ED8' }],
		[
			ServiceColor.YELLOW,
			{ backgroundColor: '#EAB308', borderColor: '#CA8A04' },
		],
		[
			ServiceColor.GREEN,
			{ backgroundColor: '#16A34A', borderColor: '#15803D' },
		],
		[
			ServiceColor.ORANGE,
			{ backgroundColor: '#EA580C', borderColor: '#C2410C' },
		],
		[
			ServiceColor.PURPLE,
			{ backgroundColor: '#9333EA', borderColor: '#7E22CE' },
		],
		[ServiceColor.GRAY, { backgroundColor: '#4B5563', borderColor: '#374151' }],
		[
			ServiceColor.BLACK,
			{ backgroundColor: '#1E293B', borderColor: '#1E293B' },
		],
	]);

	const getMinutes = (date: DateTime) => {
		return date.hour * 60 + date.minute;
	};

	const minutesFromStart =
		getMinutes(reservationStart) - getMinutes(STORES.start);

	const top = itemHeight * (minutesFromStart / 30) + offset;

	const height = itemHeight * (reservationDuration / 30);

	const currentPSTDate = DateTime.now().setZone('America/Los_Angeles');

	const isActive =
		currentPSTDate >= reservationStart && currentPSTDate < reservationEnd;
	const isCompleted = currentPSTDate >= reservationEnd;

	const backgroundColor = isActive ? blue : isCompleted ? green : red;

	const requestedText = reservation.requested_employee ? '• ' : '';
	const genderText = reservation.requested_gender
		? ` (${t(reservation.requested_gender)})`
		: '';

	const serviceText = requestedText + service.shorthand + genderText;

	const customerName = customer?.customer_name;
	const customerPhoneNumber =
		customer?.phone_number && formatPhoneNumber(customer.phone_number, true);
	const customerVipSerial = customer?.vip_serial;

	const customerID = customerPhoneNumber ?? customerVipSerial;
	const customerIDText = customerID && `[${customerID}]`;

	let customerText: string | undefined = undefined;
	if (customerName) {
		customerText = customerName;

		if (customerIDText) {
			customerText += ' ' + customerIDText;
		}
	} else if (customerIDText) {
		customerText = customerIDText;
	}

	const message = reservation.message ?? reservation.customer?.notes;

	const unCompletedElement = (
		<>
			{reservationDuration >= 25 && customerText && (
				<Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
					{customerText}
				</Text>
			)}

			{reservationDuration >= 35 && message && (
				<Text numberOfLines={3} style={styles.messageText}>
					{message}
				</Text>
			)}
		</>
	);

	const cashText = reservation.cash
		? `C${moneyToString(reservation.cash)} `
		: '';

	const machineText = reservation.machine
		? `M${moneyToString(reservation.machine)} `
		: '';

	const VIPText = reservation.vip ? `V${moneyToString(reservation.vip)} ` : '';

	const GiftCardText = reservation.gift_card
		? `G${moneyToString(reservation.gift_card)} `
		: '';

	const InsuranceText = reservation.insurance
		? `A${moneyToString(reservation.insurance)} `
		: '';

	const moneyText =
		cashText || machineText || VIPText || GiftCardText || InsuranceText
			? cashText + machineText + VIPText + GiftCardText + InsuranceText
			: undefined;

	let tipValueText = '';
	let tipText = t('Tips: ');
	switch (reservation.tip_method) {
		case TipMethod.CASH:
			tipValueText += '自';
			break;
		case TipMethod.MACHINE:
			if (reservation.tips) {
				tipValueText += moneyToString(reservation.tips);
			} else {
				tipValueText += t('No Tips');
			}
			break;
		case TipMethod.HALF:
			if (reservation.tips) {
				tipValueText += `${moneyToString(reservation.tips)} / 自`;
			} else {
				tipValueText += '自';
			}
			break;
	}
	tipText += tipValueText;

	const cashOutText = reservation.cash_out
		? t('Cash Out') + ': ' + moneyToString(reservation.cash_out)
		: undefined;

	const completedElement = (
		<>
			{reservationDuration >= 25 && moneyText && (
				<Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
					{moneyText}
				</Text>
			)}

			{reservationDuration >= 30 && tipText && (
				<Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
					{tipText}
				</Text>
			)}

			{reservationDuration >= 35 && cashOutText && (
				<Text adjustsFontSizeToFit numberOfLines={1} style={styles.text}>
					{cashOutText}
				</Text>
			)}
		</>
	);

	const timeText =
		getTimeString(reservationStart) + ' - ' + getTimeString(reservationEnd);

	const toggleModal = () => setModalVisible(!isModalVisible);
	const bedsRequired = reservation.beds_required ?? service.beds_required;

	return (
		<TouchableOpacity
			style={[styles.item, { top, height, backgroundColor, borderColor }]}
			onPress={toggleModal}
		>
			<View style={styles.container}>
				<View style={[styles.serviceColor, colourMap.get(service.color)]} />

				<View style={styles.content}>
					<Text adjustsFontSizeToFit numberOfLines={1} style={styles.title}>
						{serviceText}
					</Text>

					{isCompleted ? completedElement : unCompletedElement}

					{reservationDuration >= 20 && (
						<Text
							adjustsFontSizeToFit
							numberOfLines={1}
							style={[styles.time, { marginTop: 'auto' }]}
						>
							{timeText}
						</Text>
					)}
				</View>
			</View>

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
						{t('Reservation Details')}
					</Text>

					<Text
						adjustsFontSizeToFit
						numberOfLines={1}
						style={[styles.modalTitle, { color: modalTitleColor }]}
					>
						{service.shorthand}
					</Text>

					<Text
						adjustsFontSizeToFit
						numberOfLines={1}
						style={[
							styles.modalTitle,
							{ color: modalTitleColor, marginBottom: 20 },
						]}
					>
						{timeText}
					</Text>

					<ScrollView style={{ marginBottom: 20 }}>
						<View style={styles.modalTextContainer}>
							{reservation.requested_gender && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Requested Gender') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{reservation.requested_gender}
									</Text>
								</Text>
							)}

							{reservation.requested_employee && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Requested Employee') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{user?.username ?? t('Requested')}
									</Text>
								</Text>
							)}

							{reservation.cash && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Cash') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{moneyToString(reservation.cash)}
									</Text>
								</Text>
							)}

							{reservation.machine && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Machine') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{moneyToString(reservation.machine)}
									</Text>
								</Text>
							)}

							{reservation.vip && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('VIP') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{moneyToString(reservation.vip)}
									</Text>
								</Text>
							)}

							{reservation.gift_card && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Gift Card') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{moneyToString(reservation.gift_card)}
									</Text>
								</Text>
							)}

							{reservation.insurance && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Insurance') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{moneyToString(reservation.insurance)}
									</Text>
								</Text>
							)}

							{reservation.cash_out && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Cash Out') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{moneyToString(reservation.cash_out)}
									</Text>
								</Text>
							)}

							{tipValueText && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Tips') + ':'}

									<Text style={{ fontWeight: 'bold' }}> {tipValueText}</Text>
								</Text>
							)}

							{reservation.message && (
								<Text style={[styles.modalText, { color: textColor }]}>
									{t('Message') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{reservation.message}
									</Text>
								</Text>
							)}
						</View>

						{customer && (
							<>
								<Text
									style={[styles.modalSubTitle, { color: modalLabelColor }]}
								>
									{t('Customer')}
								</Text>

								<View style={styles.modalTextContainer}>
									{customer.customer_name && (
										<Text
											adjustsFontSizeToFit
											numberOfLines={1}
											style={[styles.modalText, { color: textColor }]}
										>
											{t('Customer Name') + ':'}

											<Text style={{ fontWeight: 'bold' }}>
												{' '}
												{customer.customer_name}
											</Text>
										</Text>
									)}

									{customer.phone_number && (
										<Text
											adjustsFontSizeToFit
											numberOfLines={1}
											style={[styles.modalText, { color: textColor }]}
										>
											{t('Phone Number') + ':'}

											<Text style={{ fontWeight: 'bold' }}>
												{' '}
												{formatPhoneNumber(customer.phone_number, true)}
											</Text>
										</Text>
									)}

									{customer.vip_serial && (
										<Text
											adjustsFontSizeToFit
											numberOfLines={1}
											style={[styles.modalText, { color: textColor }]}
										>
											{t('VIP Serial') + ':'}

											<Text style={{ fontWeight: 'bold' }}>
												{' '}
												{customer.vip_serial}
											</Text>
										</Text>
									)}

									{customer.notes && (
										<Text style={[styles.modalText, { color: textColor }]}>
											{t('Notes') + ':'}

											<Text style={{ fontWeight: 'bold' }}>
												{' '}
												{customer.notes}
											</Text>
										</Text>
									)}
								</View>
							</>
						)}

						<Text style={[styles.modalSubTitle, { color: modalLabelColor }]}>
							{t('Service')}
						</Text>

						<View style={styles.modalTextContainer}>
							{service.service_name && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Service Name') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{service.service_name}
									</Text>
								</Text>
							)}

							{service.body && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('B') + ':'}

									<Text style={{ fontWeight: 'bold' }}> {service.body}</Text>
								</Text>
							)}

							{service.feet && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('F') + ':'}

									<Text style={{ fontWeight: 'bold' }}> {service.feet}</Text>
								</Text>
							)}

							{service.acupuncture && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('A') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{service.acupuncture}
									</Text>
								</Text>
							)}

							{bedsRequired && (
								<Text
									adjustsFontSizeToFit
									numberOfLines={1}
									style={[styles.modalText, { color: textColor }]}
								>
									{t('Beds Required') + ':'}

									<Text style={{ fontWeight: 'bold' }}>
										{' '}
										{service.beds_required}
									</Text>
								</Text>
							)}
						</View>

						<Text style={[styles.modalSubTitle, { color: modalLabelColor }]}>
							{t('History')}
						</Text>

						<View style={styles.modalTextContainer}>
							<Text
								adjustsFontSizeToFit
								numberOfLines={1}
								style={[styles.modalText, { color: textColor }]}
							>
								{t('Updated By') + ':'}

								<Text style={{ fontWeight: 'bold' }}>
									{' '}
									{reservation.updated_by +
										` (${reservation.updated_at.toLocaleString()})`}
								</Text>
							</Text>

							<Text
								adjustsFontSizeToFit
								numberOfLines={1}
								style={[styles.modalText, { color: textColor }]}
							>
								{t('Created By') + ':'}

								<Text style={{ fontWeight: 'bold' }}>
									{' '}
									{reservation.created_by +
										` (${reservation.created_at.toLocaleString()})`}
								</Text>
							</Text>
						</View>
					</ScrollView>

					<TouchableOpacity
						style={[styles.closeButton, { backgroundColor: greenColor }]}
						onPress={toggleModal}
					>
						<Text style={styles.buttonText}>{t('Done')}</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	item: {
		position: 'absolute', // Position the overlay item on top of FlatList
		left: '35%',
		width: '65%',
		opacity: 0.8,
		padding: 10,
		zIndex: 1, // Ensure it stays on top of the FlatList
		borderWidth: 2,
		borderRadius: 10,
		overflow: 'hidden',
	},
	container: {
		flex: 1,
		flexDirection: 'row',
	},
	serviceColor: {
		backgroundColor: '#F1F5F9',
		borderColor: '#E2E8F0',
		height: '100%',
		width: '3%',
		marginRight: 5,
		borderRadius: 8,
		borderWidth: 2,
	},
	title: {
		color: 'white',
		fontWeight: '900',
		fontSize: 24,
	},
	text: {
		color: 'white',
		fontSize: 16,
	},
	messageText: {
		color: 'white',
		fontSize: 12,
	},
	time: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 24,
	},
	content: {},
	buttonText: {
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
		maxHeight: '80%',
	},
	modalTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 5,
	},
	modalSubTitle: {
		fontSize: 20,
		fontWeight: 'semibold',
		marginBottom: 10,
	},
	modalTextContainer: {
		width: '100%',
		marginBottom: 20,
	},
	modalText: {
		fontSize: 16,
		textAlign: 'left',
	},
	closeButton: {
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 8,
	},
});

export default ReservationTag;
