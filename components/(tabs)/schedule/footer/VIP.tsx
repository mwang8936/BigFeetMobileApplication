import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useTranslation } from 'react-i18next';

import { useThemeColor } from '@/hooks/colors/useThemeColor';

import VipPackage from '@/models/Vip-Package.Model';

import { moneyToString } from '@/utils/string.utils';

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
				<View key={`pair-${i}`} style={styles.vipContainer}>
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
	vipContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-evenly',
	},
	text: {
		fontSize: 20,
		fontWeight: 'bold',
	},
});

export default VIP;
