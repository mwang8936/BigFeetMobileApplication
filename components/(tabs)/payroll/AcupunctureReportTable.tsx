import { StyleSheet, Text } from 'react-native';

import { useTranslation } from 'react-i18next';
import { DataTable } from 'react-native-paper';

import { usePayrollDate } from '@/context-providers/PayrollDateContext';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';

import AcupunctureReport from '@/models/Acupuncture-Report.Model';

import {
	getShortMonthString,
	moneyToString,
	padStringOrNumber,
	percentageToString,
} from '@/utils/string.utils';

interface AcupunctureReportProp {
	acupunctureReport: AcupunctureReport;
}

interface RowData {
	day: number;
	acupuncture: number;
	massage: number;
	insurance: number;
	total: number;
}

const AcupunctureReportTable: React.FC<AcupunctureReportProp> = ({
	acupunctureReport,
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

	const dateText = getShortMonthString(date.month, language);

	const days = Array.from({ length: 31 }, (_, i) => i + 1);

	const data: RowData[] = days.map((day) => {
		const scheduleData = acupunctureReport.data.find(
			(row) => row.date.day === day
		);

		if (scheduleData) {
			const total =
				scheduleData.acupuncture * acupunctureReport.acupuncture_percentage +
				scheduleData.massage * acupunctureReport.massage_percentage -
				scheduleData.insurance * acupunctureReport.insurance_percentage;

			return {
				day,
				acupuncture: scheduleData.acupuncture,
				massage: scheduleData.massage,
				insurance: scheduleData.insurance,
				total,
			};
		} else {
			return {
				day,
				acupuncture: 0,
				massage: 0,
				insurance: 0,
				total: 0,
			};
		}
	});

	const acupuncturePercentage = acupunctureReport.acupuncture_percentage;
	const massagePercentage = acupunctureReport.massage_percentage;
	const insurancePercentage = acupunctureReport.insurance_percentage;

	const totalAcupuncture = data
		.map((row) => row.acupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalMassage = data
		.map((row) => row.massage)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalInsurance = data
		.map((row) => row.insurance)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalAcupunctureMoney = totalAcupuncture * acupuncturePercentage;
	const totalMassageMoney = totalMassage * massagePercentage;
	const totalInsuranceMoney = totalInsurance * insurancePercentage;

	const totalMoney = data
		.map((row) => row.total)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

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

	return (
		<DataTable style={[styles.table, { backgroundColor: rowColor }]}>
			<DataTable.Header
				style={[
					styles.header,
					{ backgroundColor: headerColor, borderBlockColor: textColor },
				]}
			>
				{titleElement(dateText)}

				{titleElement(t('Acu'))}

				{titleElement(t('Massage'))}

				{titleElement(t('Insurance'))}

				{titleElement(t('Total'))}
			</DataTable.Header>

			{data.map((row, index) => (
				<DataTable.Row
					key={index}
					style={[
						styles.row,
						{
							backgroundColor:
								index % 2 === 0 ? alternatingRowColor : undefined,
							borderBlockColor: textColor,
						},
					]}
				>
					{cellElement(row.day)}

					{cellElement(moneyToString(row.acupuncture))}

					{cellElement(moneyToString(row.massage))}

					{cellElement(moneyToString(row.insurance))}

					{cellElement(moneyToString(row.total))}
				</DataTable.Row>
			))}

			<DataTable.Row
				style={[
					styles.sumRow,
					{ backgroundColor: blueRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('SUM'))}

				{boldCellElement(moneyToString(totalAcupuncture))}

				{boldCellElement(moneyToString(totalMassage))}

				{boldCellElement(moneyToString(totalInsurance))}

				{boldCellElement('-')}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.payPerRow,
					{ backgroundColor: greenRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('PERCENT'))}

				{boldCellElement(percentageToString(acupuncturePercentage))}

				{boldCellElement(percentageToString(massagePercentage))}

				{boldCellElement('-' + percentageToString(insurancePercentage))}

				{boldCellElement('-')}
			</DataTable.Row>

			<DataTable.Row
				style={[
					styles.totalRow,
					{ backgroundColor: yellowRowColor, borderBlockColor: textColor },
				]}
			>
				{leftAlignBoldCellElement(t('TOTAL'))}

				{boldCellElement(moneyToString(totalAcupunctureMoney))}

				{boldCellElement(moneyToString(totalMassageMoney))}

				{boldCellElement(
					totalInsuranceMoney === 0
						? moneyToString(0)
						: '-' + moneyToString(totalInsuranceMoney)
				)}

				{boldCellElement('-')}
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
					{moneyToString(totalMoney)}
				</DataTable.Cell>
			</DataTable.Row>
		</DataTable>
	);
};

const styles = StyleSheet.create({
	table: {},
	header: {
		borderBottomWidth: 5,
	},
	title: {
		justifyContent: 'center',
		alignItems: 'center',
	},
	titleTextStyle: {
		fontSize: 20,
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

export default AcupunctureReportTable;
