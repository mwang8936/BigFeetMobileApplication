import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/colors/useThemeColor';

import { TipMethod } from '@/models/enums';
import Reservation from '@/models/Reservation.Model';

import { moneyToString } from '@/utils/string.utils';

interface TipsProp {
	reservations: Reservation[];
}

const Tips: React.FC<TipsProp> = ({ reservations }) => {
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');

	const borderColor = useThemeColor({}, 'border');

	const tipReservations = reservations.filter(
		(reservation) =>
			(reservation.tip_method === TipMethod.HALF ||
				reservation.tip_method === TipMethod.MACHINE) &&
			reservation.tips
	);
	tipReservations.sort(
		(a, b) => a.reserved_date.toMillis() - b.reserved_date.toMillis()
	);
	const tips = tipReservations.map((reservation) => reservation.tips as number);
	const tipsTotal = tips.reduce(
		(acc, curr) => acc + parseFloat(curr.toString()),
		0
	);
	const tipsPayout = tipsTotal * 0.9;

	const tipsText =
		tips.length === 0
			? ''
			: tips.map((tip) => moneyToString(tip)).join(' + ') + ' = ';
	const tipsTotalText = moneyToString(tipsTotal);
	const tipsPayoutText = moneyToString(tipsPayout);

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			<Text style={[styles.text, { color: textColor }]}>{t('Tips') + ':'}</Text>

			<Text
				adjustsFontSizeToFit
				numberOfLines={1}
				style={[styles.text, { color: textColor }]}
			>
				{tipsText}
				<Text style={{ fontWeight: '800' }}>{tipsTotalText}</Text>
			</Text>

			<Text style={[styles.text, { color: textColor, fontWeight: '800' }]}>
				{`${tipsTotalText} X 90% = ${tipsPayoutText}`}
			</Text>
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

export default Tips;
