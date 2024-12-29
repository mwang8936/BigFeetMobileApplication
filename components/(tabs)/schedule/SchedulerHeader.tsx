import { useThemeColor } from '@/hooks/colors/useThemeColor';
import { useUserQuery } from '@/hooks/react-query/profile.hooks';
import Schedule from '@/models/Schedule.Model';
import { getTimeString } from '@/utils/string.utils';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Text, View } from 'react-native';

interface SchedulerHeaderProp {
	schedule?: Schedule;
	setHeaderHeight(height: number): void;
}

const SchedulerHeader: React.FC<SchedulerHeaderProp> = ({
	schedule,
	setHeaderHeight,
}) => {
	const { t } = useTranslation();

	const textColor = useThemeColor({}, 'text');
	const blueColor = useThemeColor({}, 'blue');
	const redColor = useThemeColor({}, 'red');

	const borderColor = useThemeColor({}, 'border');

	const { data: user } = useUserQuery();

	const startText = schedule?.start ? getTimeString(schedule.start) : '';
	const endText = schedule?.end ? getTimeString(schedule.end) : '';
	const timeText = startText + ' - ' + endText;

	const statusText = schedule
		? schedule.on_call
			? t('On Call')
			: timeText
		: t('Not Assigned');

	const statusColor = schedule?.on_call
		? blueColor
		: schedule?.is_working
		? textColor
		: redColor;

	const handleLayout = (event: any) => {
		const { height } = event.nativeEvent.layout;
		setHeaderHeight(height);
	};

	return (
		<View
			onLayout={handleLayout}
			style={[styles.container, { borderBottomColor: borderColor }]}
		>
			<Text style={[styles.text, { color: statusColor }]}>
				{schedule?.employee.username || user?.username}
			</Text>
			<Text style={[styles.text, { color: statusColor }]}>{statusText}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		height: 'auto',
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
		borderBottomWidth: 5,
	},
	text: {
		fontSize: 24,
		fontWeight: 'bold',
	},
});

export default SchedulerHeader;
