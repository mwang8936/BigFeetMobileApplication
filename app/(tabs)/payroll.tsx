import { StyleSheet, Text } from 'react-native';

import { useTranslation } from 'react-i18next';
import { BallIndicator } from 'react-native-indicators';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import {
	acupunctureReportsQueryKey,
	payrollsQueryKey,
	userQueryKey,
} from '@/constants/Query';

import { usePayrollDate } from '@/context-providers/PayrollDateContext';

import AcupuncturistPayroll from '@/components/(tabs)/payroll/AcupuncturistPayroll';
import AcupunctureReportTable from '@/components/(tabs)/payroll/AcupunctureReportTable';
import ReceptionistPayroll from '@/components/(tabs)/payroll/ReceptionistPayroll';
import StoreEmployeePayroll from '@/components/(tabs)/payroll/StoreEmployeePayroll';
import StoreEmployeeWithCashAndTipsPayroll from '@/components/(tabs)/payroll/StoreEmployeeWithCashAndTipsPayroll';
import YearMonthPicker from '@/components/(tabs)/payroll/YearMonthPicker';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import {
	useUserAcupunctureReportsQuery,
	useUserPayrollsQuery,
} from '@/hooks/react-query/profile.hooks';
import { useToast } from '@/hooks/toast/useToast';

import { PayrollOption, PayrollPart } from '@/models/enums';
import Payroll from '@/models/Payroll.Model';

export default function PayrollScreen() {
	const { t } = useTranslation();

	const queryClient = useQueryClient();

	const { date, setDate } = usePayrollDate();

	const textColor = useThemeColor({}, 'text');
	const { showErrorToast } = useToast();

	const payrollsQuery = useUserPayrollsQuery({ ...date });
	const payrolls = payrollsQuery.data || [];

	const acupunctureReportsQuery = useUserAcupunctureReportsQuery({
		...date,
	});
	const acupunctureReports = acupunctureReportsQuery.data;

	if (payrollsQuery.isError) {
		showErrorToast(t('Error Getting Payrolls'));
	}

	if (acupunctureReportsQuery.isError) {
		showErrorToast(t('Error Getting Acupuncture Reports'));
	}

	const isLoading =
		payrollsQuery.isLoading || acupunctureReportsQuery.isLoading;

	const isAcupunctureReportFetching = useIsFetching({
		queryKey: [userQueryKey, acupunctureReportsQueryKey, date.year, date.month],
	});
	const isPayrollFetching = useIsFetching({
		queryKey: [userQueryKey, payrollsQueryKey, date.year, date.month],
	});

	const isFetching = isAcupunctureReportFetching && isPayrollFetching;
	const onRefresh = async () => {
		queryClient.refetchQueries({
			queryKey: [
				userQueryKey,
				acupunctureReportsQueryKey,
				date.year,
				date.month,
			],
		});
		queryClient.refetchQueries({
			queryKey: [userQueryKey, payrollsQueryKey, date.year, date.month],
		});
	};

	const refreshControl = (
		<RefreshControl refreshing={Boolean(isFetching)} onRefresh={onRefresh} />
	);

	const payrollElement = (payroll: Payroll) => {
		switch (payroll.option) {
			case PayrollOption.ACUPUNCTURIST:
				return (
					<AcupuncturistPayroll
						payroll={payroll}
						refreshControl={refreshControl}
					/>
				);
			case PayrollOption.RECEPTIONIST:
				return (
					<ReceptionistPayroll
						payroll={payroll}
						refreshControl={refreshControl}
					/>
				);
			case PayrollOption.STORE_EMPLOYEE:
				return (
					<StoreEmployeePayroll
						payroll={payroll}
						refreshControl={refreshControl}
					/>
				);
			case PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH:
				return (
					<StoreEmployeeWithCashAndTipsPayroll
						payroll={payroll}
						refreshControl={refreshControl}
					/>
				);
			default:
				return (
					<StoreEmployeePayroll
						payroll={payroll}
						refreshControl={refreshControl}
					/>
				);
		}
	};

	const payrollPart1 = payrolls.find(
		(payroll) => payroll.part === PayrollPart.PART_1
	);
	const payrollPart1Element = payrollPart1 && payrollElement(payrollPart1);

	const payrollPart2 = payrolls.find(
		(payroll) => payroll.part === PayrollPart.PART_2
	);
	const payrollPart2Element = payrollPart2 && payrollElement(payrollPart2);

	const acupunctureReport = acupunctureReports?.find(
		(acupunctureReport) =>
			acupunctureReport.year === date.year &&
			acupunctureReport.month === date.month
	);
	const acupunctureReportElement = acupunctureReport && (
		<AcupunctureReportTable
			acupunctureReport={acupunctureReport}
			refreshControl={refreshControl}
		/>
	);

	const noPayrollsElement =
		!payrollPart1Element &&
		!payrollPart2Element &&
		!acupunctureReportElement ? (
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={styles.scrollViewContent}
				refreshControl={refreshControl}
			>
				<Text style={[styles.textContent, { color: textColor }]}>
					{t('No Payrolls')}
				</Text>
			</ScrollView>
		) : undefined;

	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.container} edges={['top']}>
				{isLoading ? (
					<BallIndicator color={textColor} />
				) : (
					<Swiper loop={false} dotColor={textColor}>
						{noPayrollsElement}
						{payrollPart1Element}
						{payrollPart2Element}
						{acupunctureReportElement}
					</Swiper>
				)}

				<YearMonthPicker
					year={date.year}
					setYear={(year: number) => setDate({ year, month: date.month })}
					month={date.month}
					setMonth={(month: number) => setDate({ year: date.year, month })}
				/>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	scrollViewContent: {
		flexGrow: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textContent: {
		fontSize: 40,
		fontWeight: 'bold',
		margin: 'auto',
	},
});
