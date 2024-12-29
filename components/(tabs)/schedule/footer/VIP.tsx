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
import { TipMethod } from '@/models/enums';
import VipPackage from '@/models/Vip-Package.Model';

interface VIPProp {
	vipPackages: VipPackage[];
}

const VIP: React.FC<VIPProp> = ({ vipPackages }) => {
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');

	const borderColor = useThemeColor({}, 'border');

	const vipPackagesCommissionTotal = vipPackages
		.map(
			(vipPackage) =>
				vipPackage.commission_amount / vipPackage.employee_ids.length
		)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const createVIPElements = () => {
		const views = [];

		for (let i = 0; i < vipPackages.length; i += 2) {
			const vipPackage1 = vipPackages[i];
			const vipPackage2 = vipPackages[i + 1];

			const element1 = vipPackage1 && (
				<Text style={[styles.text, { color: textColor }]}>
					{vipPackage1.serial}
					<Text style={{ fontWeight: '800' }}>
						(
						{moneyToString(
							vipPackage1.commission_amount / vipPackage1.employee_ids.length
						)}
						)
					</Text>
				</Text>
			);

			const element2 = vipPackage2 && (
				<Text style={[styles.text, { color: textColor }]}>
					{vipPackage2.serial}
					<Text style={{ fontWeight: '800' }}>
						(
						{moneyToString(
							vipPackage2.commission_amount / vipPackage2.employee_ids.length
						)}
						)
					</Text>
				</Text>
			);

			views.push(
				<View
					key={`pair-${i}`}
					style={{
						flex: 1,
						flexDirection: 'row',
						justifyContent: 'space-evenly',
					}}
				>
					{element1}
					{element2}
				</View>
			);
		}

		return views;
	};

	return (
		<View style={[styles.container, { borderBottomColor: borderColor }]}>
			<Text style={[styles.text, { color: textColor }]}>{t('VIP') + ':'}</Text>
			{createVIPElements()}
			<Text style={[styles.text, { color: textColor, paddingTop: 10 }]}>
				{t('Total') + ':'}
				<Text style={{ fontWeight: '800' }}>
					{' '}
					{moneyToString(vipPackagesCommissionTotal)}
				</Text>
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

export default VIP;
