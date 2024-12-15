import {
	StyleSheet,
	StyleProp,
	ViewStyle,
	TouchableOpacity,
	type TouchableOpacityProps,
} from 'react-native';

export type ButtonType = 'default' | 'add' | 'delete' | 'edit';

export type ButtonProps = TouchableOpacityProps & {
	onPress: () => void;
	type?: ButtonType;
};

export function ColouredButton({
	onPress,
	style,
	type = 'default',
	disabled = false,
	...rest
}: ButtonProps) {
	return (
		<TouchableOpacity
			style={[
				{
					opacity: disabled ? 0.6 : 1,
					borderRadius: 10,
					justifyContent: 'center',
					alignItems: 'center',
				},
				type === 'default' ? styles.default : undefined,
				type === 'add' ? styles.add : undefined,
				type === 'delete' ? styles.delete : undefined,
				type === 'edit' ? styles.edit : undefined,
				style as StyleProp<ViewStyle>,
			]}
			disabled={disabled}
			onPress={onPress}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	default: {
		backgroundColor: '#808080',
		borderColor: '#808080',
	},
	add: {
		backgroundColor: '#32CD32',
		borderColor: '#32CD32',
	},
	delete: {
		backgroundColor: '#FF4500',
		borderColor: '#FF4500',
	},
	edit: {
		backgroundColor: '#4682B4',
		borderColor: '#4682B4',
	},
});
