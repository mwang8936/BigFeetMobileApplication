export function getDisabledColor(
	hex: string,
	lightnessFactor: number = 0.5,
	saturationFactor: number = 0.5
): string {
	// Convert hex to RGB
	const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
		let cleanHex = hex.replace('#', '');
		if (cleanHex.length === 3) {
			cleanHex = cleanHex
				.split('')
				.map((char) => char + char)
				.join('');
		}
		const bigint = parseInt(cleanHex, 16);
		return {
			r: (bigint >> 16) & 255,
			g: (bigint >> 8) & 255,
			b: bigint & 255,
		};
	};

	// Convert RGB to HSL
	const rgbToHsl = (rgb: {
		r: number;
		g: number;
		b: number;
	}): { h: number; s: number; l: number } => {
		let { r, g, b } = rgb;
		r /= 255;
		g /= 255;
		b /= 255;
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		let h = 0,
			s = 0,
			l = (max + min) / 2;

		if (max !== min) {
			const d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			switch (max) {
				case r:
					h = (g - b) / d + (g < b ? 6 : 0);
					break;
				case g:
					h = (b - r) / d + 2;
					break;
				case b:
					h = (r - g) / d + 4;
					break;
			}
			h /= 6;
		}

		return { h, s, l };
	};

	// Convert HSL to RGB
	const hslToRgb = (hsl: {
		h: number;
		s: number;
		l: number;
	}): { r: number; g: number; b: number } => {
		const hue2rgb = (p: number, q: number, t: number): number => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const { h, s, l } = hsl;
		let r: number, g: number, b: number;

		if (s === 0) {
			r = g = b = l; // Achromatic
		} else {
			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;
			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return {
			r: Math.round(r * 255),
			g: Math.round(g * 255),
			b: Math.round(b * 255),
		};
	};

	// Convert RGB to Hex
	const rgbToHex = (rgb: { r: number; g: number; b: number }): string => {
		const { r, g, b } = rgb;
		return `#${((1 << 24) | (r << 16) | (g << 8) | b)
			.toString(16)
			.slice(1)
			.toUpperCase()}`;
	};

	// Process the color
	const rgb = hexToRgb(hex);
	const hsl = rgbToHsl(rgb);
	hsl.s *= saturationFactor; // Reduce saturation
	hsl.l = Math.min(1, hsl.l + lightnessFactor * (1 - hsl.l)); // Increase lightness
	const newRgb = hslToRgb(hsl);

	return rgbToHex(newRgb);
}
