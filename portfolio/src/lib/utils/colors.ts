import {inInterval, isBlank} from './helpers'

// Credit: https://github.com/RiadhAdrani/color-utils

export const NAMED_COLORS = {
	aliceblue: '#F0F8FF',
	antiquewhite: '#FAEBD7',
	aqua: '#00FFFF',
	aquamarine: '#7FFFD4',
	azure: '#F0FFFF',
	beige: '#F5F5DC',
	bisque: '#FFE4C4',
	black: '#000000',
	blanchedalmond: '#FFEBCD',
	blue: '#0000FF',
	blueviolet: '#8A2BE2',
	brown: '#A52A2A',
	burlywood: '#DEB887',
	cadetblue: '#5F9EA0',
	chartreuse: '#7FFF00',
	chocolate: '#D2691E',
	coral: '#FF7F50',
	cornflowerblue: '#6495ED',
	cornsilk: '#FFF8DC',
	crimson: '#DC143C',
	cyan: '#00FFFF',
	darkblue: '#00008B',
	darkcyan: '#008B8B',
	darkgoldenrod: '#B8860B',
	darkgray: '#A9A9A9',
	darkgreen: '#006400',
	darkgrey: '#A9A9A9',
	darkkhaki: '#BDB76B',
	darkmagenta: '#8B008B',
	darkolivegreen: '#556B2F',
	darkorange: '#FF8C00',
	darkorchid: '#9932CC',
	darkred: '#8B0000',
	darksalmon: '#E9967A',
	darkseagreen: '#8FBC8F',
	darkslateblue: '#483D8B',
	darkslategray: '#2F4F4F',
	darkturquoise: '#00CED1',
	darkviolet: '#9400D3',
	deeppink: '#FF1493',
	deepskyblue: '#00BFFF',
	dimgray: '#696969',
	diserria: '#DDA15E',
	dodgerblue: '#1E90FF',
	firebrick: '#B22222',
	floralwhite: '#FFFAF0',
	forestgreen: '#228B22',
	fuchsia: '#FF00FF',
	gainsboro: '#DCDCDC',
	ghostwhite: '#F8F8FF',
	gold: '#FFD700',
	goldenrod: '#DAA520',
	gray: '#808080',
	green: '#008000',
	greenyellow: '#ADFF2F',
	honeydew: '#F0FFF0',
	hotpink: '#FF69B4',
	indianred: '#CD5C5C',
	indigo: '#4B0082',
	ivory: '#FFFFF0',
	khaki: '#F0E68C',
	lavender: '#E6E6FA',
	lavenderblush: '#FFF0F5',
	lawngreen: '#7CFC00',
	lemonchiffon: '#FFFACD',
	lightblue: '#ADD8E6',
	lightcoral: '#F08080',
	lightcyan: '#E0FFFF',
	lightgoldenrodyellow: '#FAFAD2',
	lightgray: '#D3D3D3',
	lightgreen: '#90EE90',
	lightgrey: '#D3D3D3',
	lightpink: '#FFB6C1',
	lightsalmon: '#FFA07A',
	lightseagreen: '#20B2AA',
	lightskyblue: '#87CEFA',
	lightslategray: '#778899',
	lightsteelblue: '#B0C4DE',
	lightyellow: '#FFFFE0',
	lime: '#00FF00',
	limegreen: '#32CD32',
	linen: '#FAF0E6',
	locust: '#A3B18A',
	magenta: '#FF00FF',
	maroon: '#800000',
	mediumaquamarine: '#66CDAA',
	mediumblue: '#0000CD',
	mediumorchid: '#BA55D3',
	mediumpurple: '#9370DB',
	mediumseagreen: '#3CB371',
	mediumslateblue: '#7B68EE',
	mediumspringgreen: '#00FA9A',
	mediumturquoise: '#48D1CC',
	mediumvioletred: '#C71585',
	midnightblue: '#191970',
	mintcream: '#F5FFFA',
	mistyrose: '#FFE4E1',
	moccasin: '#FFE4B5',
	navajowhite: '#FFDEAD',
	navy: '#000080',
	oldlace: '#FDF5E6',
	olive: '#808000',
	olivedrab: '#6B8E23',
	orange: '#FFA500',
	orangered: '#FF4500',
	orchid: '#DA70D6',
	palegoldenrod: '#EEE8AA',
	palegreen: '#98FB98',
	paleturquoise: '#AFEEEE',
	palevioletred: '#DB7093',
	papayawhip: '#FFEFD5',
	peachpuff: '#FFDAB9',
	peru: '#CD853F',
	pink: '#FFC0CB',
	plum: '#DDA0DD',
	powderblue: '#B0E0E6',
	purple: '#800080',
	red: '#FF0000',
	rosybrown: '#BC8F8F',
	royalblue: '#4169E1',
	saddlebrown: '#8B4513',
	salmon: '#FA8072',
	sandybrown: '#F4A460',
	seagreen: '#2E8B57',
	seashell: '#FFF5EE',
	sienna: '#A0522D',
	silver: '#C0C0C0',
	skyblue: '#87CEEB',
	slateblue: '#6A5ACD',
	slategray: '#708090',
	snow: '#FFFAFA',
	springgreen: '#00FF7F',
	steelblue: '#4682B4',
	tan: '#D2B48C',
	teal: '#008080',
	thistle: '#D8BFD8',
	tomato: '#FF6347',
	turquoise: '#40E0D0',
	violet: '#EE82EE',
	westar: '#DAD7CD',
	wheat: '#F5DEB3',
	white: '#FFFFFF',
	whitesmoke: '#F5F5F5',
	yellow: '#FFFF00',
	yellowgreen: '#9ACD32',
	yellowsea: '#FFAF00'
} as const;

export type NamedColor = keyof typeof NAMED_COLORS;

export type HexColor = `#${string}`;

export type Color = NamedColor | HexColor;

export const convertNamedToHexColor = (name: NamedColor): HexColor => {
	const color = NAMED_COLORS[name];

	if (!color) {
		return NAMED_COLORS.white;
	}

	return color;
};

// ----------------------------------------------------------------------


export type ColorType = 'hex' | 'hsl' | 'rgb';

export type Palette = {
	10: string;
	20: string;
	30: string;
	40: string;
	50: string;
	60: string;
	70: string;
	80: string;
	90: string;
	95: string;
	99: string;
	100: string;
};

export const HEX = 'hex';
export const HSL = 'hsl';
export const RGB = 'rgb';
export const UNKNOWN = 'unknown';

/**
 * generate an hsla color
 * @param h hue
 * @param s saturation
 * @param l lightness
 * @param a alpha
 */
export function hsla(h: number, s: number, l: number, a = 1): string {
	if (!inInterval(0, h, 360))
		throw '[Utils] Unexpected Input: "h" should be a number between 0 and 360';
	if (!inInterval(0, l, 100))
		throw '[Utils] Unexpected Input: "l" should be a number between 0 and 100';
	if (!inInterval(0, s, 100))
		throw '[Utils] Unexpected Input: "s" should be a number between 0 and 100';
	if (!inInterval(0, a, 1))
		throw '[Utils] Unexpected Input: "a" should be a number between 0 and 1';

	return `hsla(${h}deg ${s}% ${l}% / ${a})`;
}

export const HSL_REGEX =
	/^hsl\((\d{1,3})(\.\d+){0,1}deg (\d{1,3})(\.\d+){0,1}% (\d{1,3})(\.\d+){0,1}%\)$/;

export const HSLA_REGEX =
	/^hsla\((\d{1,3})(\.\d+){0,1}deg (\d{1,3})(\.\d+){0,1}% (\d{1,3})(\.\d+){0,1}%( \/ (\d{1,3})(\.\d+){0,1}){0,1}\)$/;

/**
 * check if the given color is of an hsl form
 *
 * `hsl(99deg 99% 99%)`
 *
 * note that hue, saturation, lightness values are not checked.
 * @param color target
 */
export function isHslForm(color: string): boolean {
	return isBlank(color) ? false : HSL_REGEX.test(color);
}

/**
 * check if the given color is of an hsla form
 *
 * `hsla(99deg 99% 99% / 0.99)`
 *
 * note that hue, saturation, lightness and alpha values are not checked.
 * @param color target
 */
export function isHslaForm(color: string): boolean {
	return isBlank(color) ? false : HSLA_REGEX.test(color);
}

/**
 * extract color data from an hsl/a color form.
 *
 * if the color has an invalid type, an error will be thrown.
 *
 * @param color source
 */
export function extractDataFromHSL(color: string): number[] {
	if (isHslaForm(color)) {
		return color
			.slice(5, -1)
			.replace('%', '')
			.replace('deg', '')
			.replace('/', '')
			.replace('  ', ' ')
			.split(' ')
			.map(i => parseFloat(i.trim()));
	}

	if (isHslForm(color)) {
		return color
			.slice(4, -1)
			.replace('%', '')
			.replace('deg', '')
			.replace('/', '')
			.split(' ')
			.map(i => parseFloat(i.trim()));
	}

	throw '[Utils] Unexpected Input: (color) is not of a HSL/HSLA form.';
}

/**
 * Check if the given color is in an HSL or HSLA format:
 * - `hsl(h,s,l)`
 * - `hsla(h,s,l,a)`
 * @param color target
 */
export function isHslColor(color: string): boolean {
	if (isBlank(color)) {
		return false;
	}

	if (isHslForm(color)) {
		const [h, s, l] = extractDataFromHSL(color);

		if (360 < h || h < 0) return false;
		if (100 < s || s < 0) return false;
		if (100 < l || l < 0) return false;

		return true;
	} else if (isHslaForm(color)) {
		const [h, s, l, a] = extractDataFromHSL(color);

		if (360 < h || h < 0) return false;
		if (100 < s || s < 0) return false;
		if (100 < l || l < 0) return false;

		if (a !== undefined && (1 < a || a < 0)) {
			return false;
		}

		return true;
	}

	return false;
}

/**
 * convert given `H S L` values to `R G B`
 * @param h hue
 * @param s saturation
 * @param l lightness
 */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
	// Must be fractions of 1
	s /= 100;
	l /= 100;

	h = h % 360;

	const c = (1 - Math.abs(2 * l - 1)) * s,
		x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
		m = l - c / 2;

	let r = 0,
		g = 0,
		b = 0;

	if (0 <= h && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (60 <= h && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (120 <= h && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (180 <= h && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (240 <= h && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (300 <= h && h < 360) {
		r = c;
		g = 0;
		b = x;
	}
	r = Math.round((r + m) * 255);
	g = Math.round((g + m) * 255);
	b = Math.round((b + m) * 255);

	return [r, g, b];
}

/**
 * convert given `R G B` values to `H S L`
 * @param r red
 * @param g green
 * @param b blue
 */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	// Make r, g, and b fractions of 1
	r /= 255;
	g /= 255;
	b /= 255;

	// Find greatest and smallest channel values
	const cMin = Math.min(r, g, b),
		cMax = Math.max(r, g, b),
		delta = cMax - cMin;

	let h = 0,
		s = 0,
		l = 0;

	// Calculate hue
	// No difference
	if (delta == 0) h = 0;
	// Red is max
	else if (cMax == r) h = ((g - b) / delta) % 6;
	// Green is max
	else if (cMax == g) h = (b - r) / delta + 2;
	// Blue is max
	else h = (r - g) / delta + 4;

	h = Math.round(h * 60);

	// Make negative hues positive behind 360°
	if (h < 0) h += 360;

	// Calculate lightness
	l = (cMax + cMin) / 2;

	// Calculate saturation
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

	// Multiply l and s by 100

	s = +(s * 100).toFixed(2);
	l = +(l * 100).toFixed(2);

	return [round(h), round(s), round(l)];
}

/**
 * Try to guess the correct screen color type :
 * `hex`, `hsl`, `rgb` or `unknown`
 * @param color target
 */
export function getColorType(color: string): ColorType | 'unknown' {
	return isHexColor(color) ? HEX : isHslColor(color) ? HSL : isRgbColor(color) ? RGB : UNKNOWN;
}

/**
 * convert given `R G B` values to `#rrggbbaa`
 * @param r red
 * @param g green
 * @param b blue
 * @param a alpha
 */
export function rgbToHex(r: number, g: number, b: number, a = 1): string {
	function formatHex(c: number) {
		const hex = Math.round(c).toString(16);
		return hex.length == 1 ? '0' + hex : hex;
	}

	return '#' + formatHex(r) + formatHex(g) + formatHex(b) + formatHex(a * 255);
}

const round = (n: number): number => {
	return Math.round(n * 100) / 100;
};

/**
 * convert a given css declaration to another one.
 *
 * supported types : `HEX` | `RGB` | `HSL`
 *
 * @param color source
 * @param to target type
 */
export function convertColor(color: string, to: ColorType): string {
	const type = getColorType(color);

	if (type === UNKNOWN) {
		return color;
	}
	if (![HEX, HSL, RGB].includes(to)) return color;
	if (to === type) return color;

	let [r, g, b, a] = [0, 0, 0, 1];

	if (type === HEX) {
		const c = color.substring(1);
		const l = c.length;

		if (l === 3) {
			r = parseInt(c[0] + c[0], 16);
			g = parseInt(c[1] + c[1], 16);
			b = parseInt(c[2] + c[2], 16);
		} else if (l >= 6) {
			r = parseInt(c.substring(0, 2), 16);
			g = parseInt(c.substring(2, 4), 16);
			b = parseInt(c.substring(4, 6), 16);

			if (l === 8) {
				a = round(parseInt(c.substring(6), 16) / 256);
			}
		}
	} else if (type === HSL) {
		const [h, s, l, _a] = extractDataFromHSL(color);

		if (_a !== undefined) {
			a = _a;
		}

		[r, g, b] = hslToRgb(h, s, l);
	} else if (type === RGB) {
		const [_r, _g, _b, _a] = extractDataFromRGB(color);

		if (_a !== undefined) {
			a = _a;
		}

		[r, g, b] = [_r, _g, _b];
	}

	if (to === RGB) {
		return `rgba(${r},${g},${b},${a})`;
	} else if (to === HSL) {
		const [h, s, l] = rgbToHsl(r, g, b);
		return `hsla(${h}deg ${s}% ${l}% / ${a})`;
	} else if (to === HEX) {
		return rgbToHex(r, g, b, a);
	}

	return color;
}

/**
 * Determine if the given string is a hex color.
 * @param color value
 */
export function isHexColor(color: string): boolean {
	if (isBlank(color)) return false;

	const three = /^#[0-9|a|A|b|B|c|C|d|D|e|E|f|F]{3}$/;
	const six = /^#[0-9|a|A|b|B|c|C|d|D|e|E|f|F]{6}$/;
	const eight = /^#[0-9|a|A|b|B|c|C|d|D|e|E|f|F]{8}$/;

	return three.test(color) || six.test(color) || eight.test(color);
}

/**
 * generate an rgba color :
 *
 * `rgba(255,255,255,1)`
 *
 * @param r red
 * @param g green
 * @param b blue
 * @param a alpha
 */
export function rgba(r: number, g: number, b: number, a = 1): string {
	if (!inInterval(0, r, 255))
		throw '[Utils] Unexpected Input: "r" should be a number between 0 and 255';
	if (!inInterval(0, b, 255))
		throw '[Utils] Unexpected Input: "b" should be a number between 0 and 255';
	if (!inInterval(0, g, 255))
		throw '[Utils] Unexpected Input: "g" should be a number between 0 and 255';
	if (!inInterval(0, a, 1))
		throw '[Utils] Unexpected Input: "a" should be a number between 0 and 1';

	return `rgba(${r},${g},${b},${a})`;
}

export const RGB_REGEX =
	/^rgb\((\d{1,3})(\.\d+){0,1},( ){0,1}(\d{1,3})(\.\d+){0,1},( ){0,1}(\d{1,3})(\.\d+){0,1}\)$/;

export const RGBA_REGEX =
	/^rgba\((\d{1,3})(\.\d+){0,1},( ){0,1}(\d{1,3})(\.\d+){0,1},( ){0,1}(\d{1,3})(\.\d+){0,1}(,( ){0,1}(\d{1})(\.\d+){0,1}){0,1}\)$/;

/**
 * check if the given color is of an rgb form
 *
 * `rgb(255, 255, 255)`
 *
 * note that red, green and blue values are not checked
 * @param color target
 */
export function isRgbForm(color: string): boolean {
	return isBlank(color) ? false : RGB_REGEX.test(color);
}

/**
 * check if the given color is of an rgba form
 *
 * `rgba(255, 255, 255, 0.99)`
 *
 * note that red, green, blue and alpha values are not checked.
 * @param color target
 */
export function isRgbaForm(color: string): boolean {
	return isBlank(color) ? false : RGBA_REGEX.test(color);
}

/**
 * extract color data from an rgb/a color form.
 *
 * if the color has an invalid type, an error will be thrown.
 *
 * @param color source
 */
export function extractDataFromRGB(color: string): number[] {
	if (isRgbaForm(color)) {
		return color
			.slice(5, -1)
			.split(',')
			.map(i => parseFloat(i.trim()));
	}

	if (isRgbForm(color)) {
		return color
			.slice(4, -1)
			.split(',')
			.map(i => parseFloat(i.trim()));
	}

	throw '[Utils] Unexpected Input: (color) is not of a RGB/RGBA form.';
}

/**
 * Check if the given color is in an RGB or RGBA format:
 * - `rgb(r,g,b)`
 * - `rgba(r,g,b,a)`
 * @param color
 */
export function isRgbColor(color: string): boolean {
	if (isBlank(color)) {
		return false;
	}

	if (isRgbForm(color)) {
		const [r, g, b] = extractDataFromRGB(color);

		for (const c of [r, g, b]) {
			if (!inInterval(0, c, 256)) return false;
		}

		return true;
	} else if (isRgbaForm(color)) {
		const [r, g, b, a] = extractDataFromRGB(color);

		for (const c of [r, g, b]) {
			if (!inInterval(0, c, 256)) return false;
		}

		if (a !== undefined && !inInterval(0, a, 1)) return false;

		return true;
	}

	return false;
}

function normalizeColorToRgbOrThrow(color: string): string {
	const rgb = convertColor(color, 'rgb');
	const t = getColorType(rgb);

	if (t === 'unknown') {
		throw '[Utils] Unexpected Input: unable to specify (color) type, maybe it is badly formatted ?';
	}

	return rgb;
}

function normalizeColorToHSLOrThrow(color: string): string {
	const rgb = convertColor(color, 'hsl');
	const type = getColorType(rgb);

	if (type === 'unknown') {
		throw '[Utils] Unexpected Input: unable to specify (color) type, maybe it is badly formatted ?';
	}

	return rgb;
}

/**
 * generates a safe color that could be paired with the given one,
 * as a text or background color.
 *
 * @param color source
 * @param light color for dark colors
 * @param dark color for light colors
 */
export function generateContrastSafeColor(color: string, light = '#fff', dark = '#000') {
	const c = normalizeColorToRgbOrThrow(color);

	const [r, g, b] = extractDataFromRGB(c);

	const yiq = (r * 299 + g * 587 + b * 114) / 1000;

	return yiq >= 128 ? dark : light;
}

/**
 * generates a complementary color.
 * @param color source
 * @param type result color type
 */
export function generateComplementaryColor(color: string, type?: ColorType) {
	const c = normalizeColorToHSLOrThrow(color);

	const [_h, _s, _l, _a] = extractDataFromHSL(c);

	const [h, s, l, a] = [(_h + 180) % 360, _s, _l, _a ?? 1];

	const result = `hsla(${h}deg ${s}% ${l}% / ${a})`;

	return convertColor(result, type || 'hsl');
}

/**
 * generates a tonal palette.
 * @param color
 * @param type output colors type
 * @see https://m3.material.io/styles/color/the-color-system/key-colors-tones#6bdb9471-b70d-42c9-8ace-76743c1fff13
 */
export function generateColorTonalPalette(color: string, type?: ColorType): Palette {
	const c = normalizeColorToHSLOrThrow(color);

	const palette = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

	const [h, s, , a] = extractDataFromHSL(c);

	const t = type ?? 'hsl';

	const colorPalette = {} as Palette;

	palette.forEach(tone => {
		const colorTone = hsla(h, s, tone, a ?? 1);

		colorPalette[tone as keyof Palette] = convertColor(colorTone, t);
	});

	return colorPalette;
}

/**
 * generate the same color with a modified opacity.
 * @param color source
 * @param opacity opacity
 * @param type output color type
 */
export function changeColorOpacity(color: string, opacity: number, type?: ColorType) {
	const c = normalizeColorToHSLOrThrow(color);

	if (!inInterval(0, opacity, 1))
		throw '[Utils] Unexpected Input: opacity should be a number between 0 and 1';

	const [h, s, l] = extractDataFromHSL(c);

	return convertColor(hsla(h, s, l, opacity), type ?? 'hex');
}