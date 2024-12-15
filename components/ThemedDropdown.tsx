import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { useThemeColor } from '@/hooks/useThemeColor';
import { DropdownProps } from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import { Ionicons } from '@expo/vector-icons';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export type DropdownSizeType =
	| 'small'
	| 'smallSemiBold'
	| 'smallBold'
	| 'medium'
	| 'mediumSemiBold'
	| 'mediumBold'
	| 'large'
	| 'largeSemiBold'
	| 'largeBold';

export type Option = {
	label: string;
	value: string | number | null;
	icon?: IconName;
};

export type ThemedDropDownProps = DropdownProps<Option> & {
	option: Option;
	placeholderText?: string;
	required?: boolean;
	iconName?: IconName;
	lightColor?: string;
	darkColor?: string;
	type?: DropdownSizeType;
};

export function ThemedDropdown({
	data,
	option,
	placeholderText,
	required,
	disable = false,
	iconName,
	style,
	lightColor,
	darkColor,
	type = 'small',
	...rest
}: ThemedDropDownProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
	const backgroundColor = useThemeColor(
		{ light: lightColor, dark: darkColor },
		'background'
	);

	const [isFocused, setIsFocused] = useState(false);

	const missingRequired = required && option.value === null;

	const renderItem = (item: Option) => {
		const selected = item.value === option.value;
		return (
			<View
				style={[
					{ backgroundColor: selected ? '#909090' : backgroundColor },
					styles.item,
				]}>
				<Ionicons name={item.icon} size={20} style={[{ color }, styles.icon]} />
				<Text style={[{ color }, styles.label]}>{item.label}</Text>
			</View>
		);
	};

	return (
		<Dropdown
			style={[
				{
					backgroundColor: disable ? '#ccc' : undefined,
					borderColor: missingRequired
						? '#FF3B30'
						: isFocused
						? '#007AFF'
						: '#2a2a2a',
				},
				styles.dropdown,
				style,
			]}
			containerStyle={{ backgroundColor }}
			placeholderStyle={[
				{ color: '#848484' },
				type === 'small' ? styles.small : undefined,
				type === 'smallSemiBold' ? styles.smallSemiBold : undefined,
				type === 'smallBold' ? styles.smallBold : undefined,
				type === 'medium' ? styles.medium : undefined,
				type === 'mediumSemiBold' ? styles.mediumSemiBold : undefined,
				type === 'mediumBold' ? styles.mediumBold : undefined,
				type === 'large' ? styles.large : undefined,
				type === 'largeSemiBold' ? styles.largeSemiBold : undefined,
				type === 'largeBold' ? styles.largeBold : undefined,
			]}
			selectedTextStyle={[
				{ color },
				type === 'small' ? styles.small : undefined,
				type === 'smallSemiBold' ? styles.smallSemiBold : undefined,
				type === 'smallBold' ? styles.smallBold : undefined,
				type === 'medium' ? styles.medium : undefined,
				type === 'mediumSemiBold' ? styles.mediumSemiBold : undefined,
				type === 'mediumBold' ? styles.mediumBold : undefined,
				type === 'large' ? styles.large : undefined,
				type === 'largeSemiBold' ? styles.largeSemiBold : undefined,
				type === 'largeBold' ? styles.largeBold : undefined,
			]}
			inputSearchStyle={[{ color }, styles.inputSearchStyle]}
			iconStyle={styles.iconStyle}
			data={data}
			search
			maxHeight={300}
			placeholder={!isFocused ? placeholderText ?? 'Select item' : '...'}
			searchPlaceholder="Search..."
			value={option}
			disable={disable}
			onFocus={() => setIsFocused(true)}
			onBlur={() => setIsFocused(false)}
			renderItem={renderItem}
			renderLeftIcon={
				iconName
					? () => (
							<Ionicons
								style={[{ color }, styles.icon]}
								name={!option.value ? iconName : option.icon}
								size={20}
							/>
					  )
					: undefined
			}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	container: {
		paddingVertical: 6,
	},
	dropdown: {
		height: 50,
		borderWidth: 4,
		borderRadius: 10,
		paddingVertical: 6,
		paddingHorizontal: 8,
	},
	item: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 12,
	},
	icon: {
		marginRight: 5,
	},
	label: {
		fontSize: 16,
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
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});
