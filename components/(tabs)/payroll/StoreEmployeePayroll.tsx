import { ReactElement, useMemo, useState } from 'react';
import {
	RefreshControlProps,
	StyleSheet,
	Text,
	TouchableOpacity,
	FlatList,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import { DataTable } from 'react-native-paper';

import { usePayrollDate } from '@/context-providers/PayrollDateContext';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';

import { PayrollPart } from '@/models/enums';
import Payroll from '@/models/Payroll.Model';

import {
	getShortMonthString,
	moneyToString,
	padStringOrNumber,
} from '@/utils/string.utils';

import CashAndTipsPayroll from './CashAndTipPayroll';

interface StoreEmployeePayrollProp {
	payroll: Payroll;
	refreshControl: ReactElement<RefreshControlProps>;
}

interface RowData {
	day: number;
	body: number;
	feet: number;
}

const StoreEmployeePayroll: React.FC<StoreEmployeePayrollProp> = ({
	payroll,
	refreshControl,
}) => {
	const { t } = useTranslation();

	const { date } = usePayrollDate();

	const userQuery = useUserQuery({});
	const user = userQuery.data;

	const language = user?.language;

	const textColor = useThemeColor({}, 'text');

	const headerColor = useThemeColor({}, 'header');
	const rowColor = useThemeColor({}, 'row');
	const alternatingRowColor = useThemeColor({}, 'alternatingRow');
	const blueRowColor = useThemeColor({}, 'blueRow');
	const greenRowColor = useThemeColor({}, 'greenRow');
	const yellowRowColor = useThemeColor({}, 'yellowRow');
	const goldRowColor = useThemeColor({}, 'goldRow');

	const [isCashOutMode, setIsCashOutMode] = useState(false);

	const dateText =
		getShortMonthString(date.month, language) +
		' ' +
		(payroll.part === PayrollPart.PART_1 ? t('(1/2)') : t('(2/2)'));

	const days =
		payroll.part === PayrollPart.PART_1
			? Array.from({ length: 15 }, (_, i) => i + 1)
			: Array.from({ length: 16 }, (_, i) => i + 16);

	const data: RowData[] = days.map((day) => {
		const scheduleData = payroll.data.find((row) => row.date.day === day);

		if (scheduleData) {
			return {
				day,
				body: scheduleData.body_sessions + scheduleData.acupuncture_sessions,
				feet: scheduleData.feet_sessions,
			};
		} else {
			return {
				day,
				body: 0,
				feet: 0,
			};
		}
	});

	const bodyRate = payroll.employee.body_rate ?? 0;
	const feetRate = payroll.employee.feet_rate ?? 0;

	const totalBodySessions = data
		.map((row) => row.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalFeetSessions = data
		.map((row) => row.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalBodyMoney = totalBodySessions * bodyRate;
	const totalFeetMoney = totalFeetSessions * feetRate;

	const cheque = totalBodyMoney + totalFeetMoney;

	const titleElement = (title: string) => {
		return (
			<DataTable.Cell style={styles.title}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.titleTextStyle, { color: textColor }]}
				>
					{title}
				</Text>
			</DataTable.Cell>
		);
	};

	const cellElement = (text: string | number) => {
		return (
			<DataTable.Cell style={styles.cell}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.cellTextStyle, { color: textColor }]}
				>
					{padStringOrNumber(text)}
				</Text>
			</DataTable.Cell>
		);
	};

	const leftAlignBoldCellElement = (text: string | number) => {
		return (
			<DataTable.Cell>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.boldedCellTextStyle, { color: textColor }]}
				>
					{text}
				</Text>
			</DataTable.Cell>
		);
	};

	const boldCellElement = (text: string | number) => {
		return (
			<DataTable.Cell style={styles.cell}>
				<Text
					adjustsFontSizeToFit
					numberOfLines={1}
					style={[styles.boldedCellTextStyle, { color: textColor }]}
				>
					{text}
				</Text>
			</DataTable.Cell>
		);
	};

	const header = (
		<DataTable.Header
			style={[
				styles.header,
				{
					backgroundColor: headerColor,
					borderBlockColor: textColor,
				},
			]}
		>
			{titleElement(dateText)}
			{titleElement(t('Body'))}
			{titleElement(t('Feet'))}
		</DataTable.Header>
	);

	const renderItem = ({ item, index }: { item: RowData; index: number }) => (
		<DataTable.Row
			key={index}
			style={[
				styles.row,
				{
					backgroundColor: index % 2 === 0 ? alternatingRowColor : undefined,
					borderBlockColor: textColor,
				},
			]}
		>
			{cellElement(item.day)}
			{cellElement(item.body)}
			{cellElement(item.feet)}
		</DataTable.Row>
	);

	const footer = (
		<>
			<DataTable.Row
				style={[
					styles.sumRow,
					{ backgroundColor: blueRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('SUM'))}

				{boldCellElement(totalBodySessions)}

				{boldCellElement(totalFeetSessions)}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.payPerRow,
					{ backgroundColor: greenRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('PAY/PER'))}

				{boldCellElement(moneyToString(bodyRate) + '/B')}

				{boldCellElement(moneyToString(feetRate) + '/F')}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.totalRow,
					{
						backgroundColor: yellowRowColor,
						borderBlockColor: textColor,
					},
				]}
			>
				{leftAlignBoldCellElement(t('TOTAL'))}

				{boldCellElement(moneyToString(bodyRate) + '/B')}

				{boldCellElement(moneyToString(feetRate) + '/F')}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.chequeRow,
					{ backgroundColor: goldRowColor, borderBlockColor: textColor },
				]}
			>
				<DataTable.Cell
					textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
				>
					{t('CHEQUE')}
				</DataTable.Cell>

				<DataTable.Cell
					numeric
					textStyle={[styles.extraBoldedCellTextStyle, { color: textColor }]}
				>
					{moneyToString(cheque)}
				</DataTable.Cell>
			</DataTable.Row>
		</>
	);

	const payrollTable = (
		<DataTable style={[styles.table, { backgroundColor: rowColor }]}>
			<FlatList
				data={data}
				renderItem={renderItem}
				keyExtractor={(_, index) => index.toString()}
				refreshControl={refreshControl}
				ListHeaderComponent={header}
				ListFooterComponent={footer}
				stickyHeaderIndices={[0]}
			/>
		</DataTable>
	);

	const cashOutTable = useMemo(() => {
		return (
			<CashAndTipsPayroll payroll={payroll} refreshControl={refreshControl} />
		);
	}, [payroll]);

	return (
		<TouchableOpacity
			onLongPress={() => setIsCashOutMode(!isCashOutMode)}
			activeOpacity={1}
			style={styles.wrapper}
		>
			{isCashOutMode ? cashOutTable : payrollTable}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: '100%',
	},
	table: {},
	header: {
		borderBottomWidth: 5,
	},
	title: { justifyContent: 'center', alignItems: 'center' },
	titleTextStyle: {
		fontSize: 24,
		fontWeight: 'bold',
		marginVertical: 'auto',
		textAlign: 'center',
		paddingHorizontal: 8,
		paddingVertical: 16,
	},
	row: {},
	cell: { justifyContent: 'center', alignItems: 'center' },
	cellTextStyle: {
		fontSize: 20,
		paddingHorizontal: 8,
	},
	sumRow: {
		borderTopWidth: 2,
		borderBottomWidth: 1,
	},
	boldedCellTextStyle: {
		fontWeight: 'bold',
		fontSize: 20,
		paddingHorizontal: 4,
	},
	payPerRow: {
		borderTopWidth: 2,
		borderBottomWidth: 1,
	},
	totalRow: {
		borderTopWidth: 2,
		borderBottomWidth: 1,
	},
	chequeRow: {
		borderTopWidth: 4,
		borderBottomWidth: 1,
	},
	extraBoldedCellTextStyle: {
		fontWeight: '900',
		fontSize: 24,
		paddingHorizontal: 4,
	},
});

export default StoreEmployeePayroll;
