import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { Text, View, StyleSheet, Alert, Pressable, Modal } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function PayrollScreen() {
	const [selectedValue, setSelectedValue] = useState('Option1');

	const [modalVisible, setModalVisible] = useState(false);
	return (
		<SafeAreaProvider>
			<SafeAreaView style={styles.centeredView}>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
						Alert.alert('Modal has been closed.');
						setModalVisible(!modalVisible);
					}}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={styles.modalText}>Hello World!</Text>
							<Picker
								itemStyle={styles.picker}
								selectionColor={'#FF5733'}
								style={styles.picker}
								// enabled={false}
								selectedValue={selectedValue}
								onValueChange={(itemValue, itemIndex) =>
									setSelectedValue(itemValue)
								}>
								<Picker.Item label="Option 1" value="Option1" />
								<Picker.Item label="Option 2" value="Option2" />
								<Picker.Item label="Option 3" value="Option3" />
								<Picker.Item label="Option 4" value="Option4" />
								<Picker.Item label="Option 5" value="Option5" />
								<Picker.Item label="Option 6" value="Option6" />
								<Picker.Item label="Option 7" value="Option7" />
								<Picker.Item label="Option 8" value="Option8" />
								<Picker.Item label="Option 9" value="Option9" />
							</Picker>
							<Pressable
								style={[styles.button, styles.buttonClose]}
								onPress={() => setModalVisible(!modalVisible)}>
								<Text style={styles.textStyle}>Hide Modal</Text>
							</Pressable>
						</View>
					</View>
				</Modal>

				{/* <Modal
					animationType="slide"
					transparent={true}
					visible={changePasswordModalVisible}>
					<View style={styles.centeredView}>
						<View style={styles.modalView}>
							<Text style={{}}>Hello World!</Text>

							<View style={styles.buttonContainer}>
								<ColouredButton
									type="default"
									style={{
										padding: 8,
										marginEnd: 8,
										marginVertical: 12,
										borderRadius: 6,
										borderWidth: 2,
										borderColor: '#999999',
									}}
									onPress={() => setChangePasswordModalVisible(false)}>
									<Text style={{ color: 'white' }}>Cancel</Text>
								</ColouredButton>

								<ColouredButton
									type="edit"
									style={{
										padding: 8,
										marginEnd: 8,
										marginVertical: 12,
										borderRadius: 6,
										borderWidth: 2,
										borderColor: '#999999',
									}}
									onPress={handleLogout}>
									<Text style={{ color: 'white' }}>Update</Text>
								</ColouredButton>
							</View>
						</View>
					</View>
				</Modal> */}
				<Pressable
					style={[styles.button, styles.buttonOpen]}
					onPress={() => setModalVisible(true)}>
					<Text style={styles.textStyle}>Show Modal</Text>
				</Pressable>
			</SafeAreaView>
		</SafeAreaProvider>
	);
}

const styles = StyleSheet.create({
	picker: {
		color: '#000000', // Light text color for contrast
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: '#F194FF',
	},
	buttonClose: {
		backgroundColor: '#2196F3',
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginBottom: 15,
		textAlign: 'center',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	modalView: {
		margin: 20,
		backgroundColor: 'white',
		borderRadius: 20,
		width: '80%',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		width: '100%',
		marginTop: 20,
		backgroundColor: '#dddddd',
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
	},
});
