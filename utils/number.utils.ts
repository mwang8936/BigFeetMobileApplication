/**
 * Returns the corresponding float number for a valid float string.
 *
 * @param text - The string to convert to a float number.
 * @returns A number if the string is a valid float number, otherwise null.
 */
export function convertStringToFloat(text: string): number | null {
	return !isNaN(parseFloat(text)) ? parseFloat(text) : null;
}

/**
 * Returns the corresponding int number for a valid int string.
 *
 * @param text - The string to convert to a int number.
 * @returns A number if the string is a valid int number, otherwise null.
 */
export function convertStringToInt(text: string): number | null {
	return !isNaN(parseInt(text)) ? parseInt(text) : null;
}
