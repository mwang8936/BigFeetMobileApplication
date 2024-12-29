import { useThemeColor } from '@/hooks/colors/useThemeColor';
import * as React from 'react';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';
import Schedule from '@/models/Schedule.Model';
import { getTimeString, moneyToString } from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';
import { DateTime } from 'luxon';
import Reservation from '@/models/Reservation.Model';
import { isHoliday } from '@/utils/date.utils';
import { useScheduleDate } from '@/context-providers/ScheduleDateContext';

interface TotalProp {
	reservations: Reservation[];
}

const Total: React.FC<TotalProp> = ({ reservations }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDate();

	const textColor = useThemeColor({}, 'text');

	const borderColor = useThemeColor({}, 'border');

	const bodyReservations = reservations.filter(
		(reservation) => reservation.service.body > 0
	);
	bodyReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const bodyTotal = bodyReservations
		.map((reservation) => reservation.service.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const feetReservations = reservations.filter(
		(reservation) => reservation.service.feet > 0
	);
	feetReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const feetTotal = feetReservations
		.map((reservation) => reservation.service.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const acupunctureReservations = reservations.filter(
		(reservation) => reservation.service.acupuncture > 0
	);

	const normalAcupunctureReservations = acupunctureReservations.filter(
		(reservation) => !reservation.insurance
	);
	normalAcupunctureReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const normalAcupunctureTotal = normalAcupunctureReservations
		.map((reservation) => reservation.service.acupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const insuranceAcupunctureReservations = acupunctureReservations.filter(
		(reservation) => reservation.insurance
	);
	insuranceAcupunctureReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const insuranceAcupunctureTotal = insuranceAcupunctureReservations
		.map((reservation) => reservation.service.acupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const requestedReservations = reservations.filter(
		(reservation) =>
			reservation.requested_employee &&
			(reservation.service.body > 0 ||
				reservation.service.feet > 0 ||
				reservation.service.acupuncture > 0)
	);
	requestedReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const requestedTotal = requestedReservations
		.flatMap((reservation) => [
			reservation.service.acupuncture,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalSessions =
		bodyTotal + feetTotal + normalAcupunctureTotal + insuranceAcupunctureTotal;
	const holidayPay = isHoliday(date) ? totalSessions * 2 : 0;

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			<Text style={[styles.text, { color: textColor }]}>
				{'B:'}
				<Text style={{ fontWeight: '800' }}> {bodyTotal}</Text>
			</Text>

			<Text style={[styles.text, { color: textColor }]}>
				{'F:'}
				<Text style={{ fontWeight: '800' }}> {feetTotal}</Text>
			</Text>

			<Text style={[styles.text, { color: textColor }]}>
				{'A:'}
				<Text style={{ fontWeight: '800' }}> {normalAcupunctureTotal}</Text>
			</Text>

			{insuranceAcupunctureTotal > 0 && (
				<Text style={[styles.text, { color: textColor }]}>
					{'A (I):'}
					<Text style={{ fontWeight: '800' }}>
						{' '}
						{insuranceAcupunctureTotal}
					</Text>
				</Text>
			)}

			<Text style={[styles.text, { color: textColor }]}>
				{t('Requested Pay') + ':'}
				<Text style={{ fontWeight: '800' }}>
					{' '}
					{`${requestedTotal} X \$1 = ${moneyToString(requestedTotal)}`}
				</Text>
			</Text>

			{isHoliday(date) && (
				<Text style={[styles.text, { color: textColor }]}>
					{t('Holiday Pay') + ':'}
					<Text style={{ fontWeight: '800' }}>
						{' '}
						{`${totalSessions} X \$2 = ${moneyToString(holidayPay)}`}
					</Text>
				</Text>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 'auto',
		padding: 20,
		borderBottomWidth: 5,
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});

export default Total;
