import React, { forwardRef, useState } from 'react';
import { type TextInputProps, StyleSheet, TextInput } from 'react-native';

import { useThemeColor } from '@/hooks/colors/useThemeColor';

export type TextSizeType =
	| 'small'
	| 'smallSemiBold'
	| 'smallBold'
	| 'medium'
	| 'mediumSemiBold'
	| 'mediumBold'
	| 'large'
	| 'largeSemiBold'
	| 'largeBold';

export type ThemedTextProps = TextInputProps & {
	text: string;
	setText: (text: string) => void;
	required?: boolean;
	invalid?: boolean;
	setInvalid?: (invalid: boolean) => void;
	pattern?: RegExp;
	lightColor?: string;
	darkColor?: string;
	type?: TextSizeType;
};

export const ThemedTextInput = forwardRef<TextInput, ThemedTextProps>(
	(
		{
			text,
			setText,
			invalid,
			setInvalid,
			pattern,
			editable = true,
			required,
			style,
			lightColor,
			darkColor,
			type = 'small',
			...rest
		},
		ref
	) => {
		const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

		const [isFocused, setIsFocused] = useState(false);

		const missingRequired = required && text.length === 0;

		const onChangeText = (input: string) => {
			setText(input);

			if (pattern && setInvalid) {
				setInvalid(!pattern.test(input));
			}
		};

		return (
			<TextInput
				ref={ref}
				style={[
					{
						color,
						backgroundColor: !editable ? '#ccc' : undefined,
						borderColor:
							invalid || missingRequired
								? '#FF3B30'
								: isFocused
								? '#007AFF'
								: '#2a2a2a',
					},
					styles.container,
					type === 'small' ? styles.small : undefined,
					type === 'smallSemiBold' ? styles.smallSemiBold : undefined,
					type === 'smallBold' ? styles.smallBold : undefined,
					type === 'medium' ? styles.medium : undefined,
					type === 'mediumSemiBold' ? styles.mediumSemiBold : undefined,
					type === 'mediumBold' ? styles.mediumBold : undefined,
					type === 'large' ? styles.large : undefined,
					type === 'largeSemiBold' ? styles.largeSemiBold : undefined,
					type === 'largeBold' ? styles.largeBold : undefined,
					style,
				]}
				editable={editable}
				placeholderTextColor="#848484"
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				value={text}
				onChangeText={onChangeText}
				{...rest}
			/>
		);
	}
);

// Set a display name for better debugging
ThemedTextInput.displayName = 'ThemedTextInput';

const styles = StyleSheet.create({
	container: {
		borderWidth: 4,
		paddingHorizontal: 8,
		paddingVertical: 6,
		borderRadius: 10,
		textAlignVertical: 'center',
	},
	small: {
		fontSize: 16,
	},
	smallSemiBold: {
		fontSize: 16,
		fontWeight: '600',
	},
	smallBold: {
		fontSize: 16,
		fontWeight: 'bold',
	},
	medium: {
		fontSize: 24,
	},
	mediumSemiBold: {
		fontSize: 24,
		fontWeight: '600',
	},
	mediumBold: {
		fontSize: 24,
		fontWeight: 'bold',
	},
	large: {
		fontSize: 32,
	},
	largeSemiBold: {
		fontSize: 32,
		fontWeight: '600',
	},
	largeBold: {
		fontSize: 32,
		fontWeight: 'bold',
	},
});
