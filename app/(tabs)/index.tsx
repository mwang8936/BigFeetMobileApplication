import YearMonthPicker from '@/components/(tabs)/payroll/YearMonthPicker';
import { Link } from 'expo-router';
import { Text, View, StyleSheet, FlatList } from 'react-native';

export default function SchedulerScreen() {
	const data = [
		{ id: '1', name: 'Item 1' },
		{ id: '2', name: 'Item 2' },
		{ id: '3', name: 'Item 3' },
		{ id: '4', name: 'Item 4' },
		{ id: '5', name: 'Item 1' },
		{ id: '6', name: 'Item 2' },
		{ id: '7', name: 'Item 3' },
		{ id: '8', name: 'Item 4' },
		{ id: '9', name: 'Item 1' },
		{ id: '10', name: 'Item 2' },
		{ id: '11', name: 'Item 3' },
		{ id: '12', name: 'Item 4' },
		{ id: '13', name: 'Item 1' },
		{ id: '14', name: 'Item 2' },
		{ id: '15', name: 'Item 3' },
		{ id: '16', name: 'Item 4' },
	];

	const renderItem = ({ item }) => (
		<View style={styles.item}>
			<Text>{item.name}</Text>
		</View>
	);
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home Screen</Text>
			<Link href="/login" style={styles.button}>
				Go to About screen NOW!
			</Link>
			<FlatList
				style={{ width: '100%' }}
				data={data} // Array of items to render
				renderItem={renderItem} // Function to render each item
				keyExtractor={(item) => item.id} // Unique key for each item
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#25292e',
		alignItems: 'center',
		justifyContent: 'center',
	},
	text: {
		color: '#fff',
	},
	button: {
		fontSize: 20,
		textDecorationLine: 'underline',
		color: '#fff',
	},
	item: {
		padding: 40,
		borderBottomWidth: 1,
		borderColor: '#ccc',
	},
});
