// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/

import { type ComponentProps } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { type IconProps } from '@expo/vector-icons/build/createIconSet';

export function TabBarIcon({
	style,
	...rest
}: IconProps<ComponentProps<typeof Ionicons>['name']>) {
	return (
		<Ionicons size={28} style={[{ marginHorizontal: -3 }, style]} {...rest} />
	);
}
