import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { useTranslation } from 'react-i18next';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';

import { getDateString, getShortMonthString } from '@/utils/string.utils';

interface YearMonthDayPickerProp {
	year: number;
	setYear(year: number): void;
	month: number;
	setMonth(month: number): void;
	day: number;
	setDay(day: number): void;
}

const YearMonthDayPicker: React.FC<YearMonthDayPickerProp> = ({
	year,
	setYear,
	month,
	setMonth,
	day,
	setDay,
}) => {
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');

	const backgroundColor = useThemeColor({}, 'background');

	const blueColor = useThemeColor({}, 'blue');
	const greenColor = useThemeColor({}, 'green');

	const modalBackgroundColor = useThemeColor({}, 'modalBackground');
	const modalTitleColor = useThemeColor({}, 'modalTitle');
	const modalLabelColor = useThemeColor({}, 'modalLabel');

	const [isModalVisible, setModalVisible] = useState(false);

	const userQuery = useUserQuery({});
	const user = userQuery.data;

	const language = user?.language;

	const calculateNumDays = (month: number) => {
		let numDays = 31;
		if (month === 4 || month === 6 || month === 9 || month === 11) {
			numDays = 30;
		} else if (month === 2) {
			numDays = 28;
			if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
				numDays = 29;
			}
		}
		return numDays;
	};

	useEffect(() => {
		const numDays = calculateNumDays(month);

		if (day > numDays) {
			setDay(numDays);
		}
	}, [month]);

	const generateYearPickerItems = (start: number, end: number) => {
		const years = [];
		for (let i = start; i <= end; i++) {
			years.push(i);
		}

		return years.map((yr) => (
			<Picker.Item key={yr} label={`${yr}`} value={yr} />
		));
	};

	const generateMonthPickerItems = () => {
		return [...Array(12).keys()].map((mn) => {
			return (
				<Picker.Item
					key={mn + 1}
					label={getShortMonthString(mn + 1, language)}
					value={mn + 1}
				/>
			);
		});
	};

	const generateDayPickerItems = () => {
		return [...Array(calculateNumDays(month)).keys()].map((day) => {
			return (
				<Picker.Item
					key={day + 1}
					label={(day + 1).toString()}
					value={day + 1}
				/>
			);
		});
	};

	const toggleModal = () => setModalVisible(!isModalVisible);

	return (
		<View style={[styles.container, { backgroundColor: backgroundColor }]}>
			<Text style={[styles.text, { color: textColor }]}>
				{`${t('Selected')}: ${getDateString(year, month, day, language)}`}
			</Text>

			<TouchableOpacity
				style={[styles.openButton, { backgroundColor: blueColor }]}
				onPress={toggleModal}
			>
				<Text style={styles.buttonText}>{t('Select Date')}</Text>
			</TouchableOpacity>

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
						{t('Pick Date')}
					</Text>

					<View style={styles.pickerContainer}>
						{/* Year Picker */}
						<View style={styles.pickerWrapper}>
							<Text style={[styles.pickerLabel, { color: modalLabelColor }]}>
								{t('Year')}
							</Text>

							<Picker
								selectedValue={year}
								onValueChange={(itemValue) => setYear(Number(itemValue))}
								style={styles.picker}
								itemStyle={{ color: textColor }}
							>
								{generateYearPickerItems(2020, 2050)}
							</Picker>
						</View>

						{/* Month Picker */}
						<View style={styles.pickerWrapper}>
							<Text style={[styles.pickerLabel, { color: modalLabelColor }]}>
								{t('Month')}
							</Text>

							<Picker
								selectedValue={month}
								onValueChange={(itemValue) => setMonth(Number(itemValue))}
								style={styles.picker}
								itemStyle={{ color: textColor }}
							>
								{generateMonthPickerItems()}
							</Picker>
						</View>

						{/* Day Picker */}
						<View style={styles.pickerWrapper}>
							<Text style={[styles.pickerLabel, { color: modalLabelColor }]}>
								{t('Day')}
							</Text>

							<Picker
								selectedValue={day}
								onValueChange={(itemValue) => setDay(Number(itemValue))}
								style={styles.picker}
								itemStyle={{ color: textColor }}
							>
								{generateDayPickerItems()}
							</Picker>
						</View>
					</View>

					<TouchableOpacity
						style={[styles.closeButton, { backgroundColor: greenColor }]}
						onPress={toggleModal}
					>
						<Text style={styles.buttonText}>{t('Done')}</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 'auto',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	text: {
		fontSize: 18,
		marginBottom: 20,
		fontWeight: 'bold',
	},
	openButton: {
		padding: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
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
		paddingVertical: 20,
		paddingHorizontal: 5,
		marginHorizontal: 10,
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 20,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	pickerContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: '100%',
		marginBottom: 20,
	},
	pickerWrapper: {
		flex: 1,
		alignItems: 'center',
	},
	pickerLabel: {
		fontSize: 16,
		marginBottom: 10,
	},
	picker: {
		width: '100%',
		height: 200,
	},
	closeButton: {
		paddingVertical: 12,
		paddingHorizontal: 30,
		borderRadius: 8,
	},
});

export default YearMonthDayPicker;
