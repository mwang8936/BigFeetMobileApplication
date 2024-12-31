import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {
	BallIndicator,
	BarIndicator,
	BaseIndicatorProps,
	DotIndicator,
	MaterialIndicator,
	PacmanIndicator,
	PulseIndicator,
	SkypeIndicator,
	UIActivityIndicator,
	WaveIndicator,
} from 'react-native-indicators';

import { useThemeColor } from '@/hooks/colors/useThemeColor';

export type ThemedLoadingSpinnerProps = BaseIndicatorProps & {
	isLoading: boolean;
	message: string;
	lightColor?: string;
	darkColor?: string;
	indicator?:
		| 'ball'
		| 'bar'
		| 'dot'
		| 'material'
		| 'pacman'
		| 'pulse'
		| 'skype'
		| 'ui'
		| 'wave';
};

export const ThemedLoadingSpinner: React.FC<ThemedLoadingSpinnerProps> = ({
	isLoading,
	message,
	lightColor,
	darkColor,
	indicator,
	...rest
}) => {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

	if (!isLoading) return <View />;

	const renderIndicator = () => {
		switch (indicator) {
			case 'ball':
				return <BallIndicator color={color} {...rest} />;
			case 'bar':
				return <BarIndicator color={color} {...rest} />;
			case 'dot':
				return <DotIndicator color={color} {...rest} />;
			case 'material':
				return <MaterialIndicator color={color} {...rest} />;
			case 'pacman':
				return <PacmanIndicator color={color} {...rest} />;
			case 'pulse':
				return <PulseIndicator color={color} {...rest} />;
			case 'skype':
				return <SkypeIndicator color={color} {...rest} />;
			case 'ui':
				return <UIActivityIndicator color={color} {...rest} />;
			case 'wave':
				return <WaveIndicator color={color} {...rest} />;
			default:
				return undefined;
		}
	};

	return (
		<View style={styles.overlay}>
			<View style={styles.container}>
				{renderIndicator()}

				{message && (
					<Text style={[styles.message, { color: color }]}>{message}</Text>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 1000,
	},
	container: {
		alignItems: 'center',
		justifyContent: 'center',
		maxHeight: '15%',
		paddingHorizontal: 20,
	},
	message: {
		marginTop: 10,
		fontSize: 16,
		textAlign: 'center',
	},
});
