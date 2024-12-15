import { Link } from 'expo-router';
import { Text, View, StyleSheet } from 'react-native';

export default function SchedulerScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Home Screen</Text>
			<Link href="/login" style={styles.button}>
				Go to About screen NOW!
			</Link>
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
});
