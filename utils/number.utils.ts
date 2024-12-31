/**
 * Converts a valid string to a float number.
 *
 * This function attempts to parse a given string into a floating-point number.
 * If the string represents a valid float, the corresponding number is returned.
 * If the string is not a valid float, `null` is returned.
 *
 * @param {string} text - The string to be converted into a float number.
 *
 * @returns {number | null} - A floating-point number if the string is a valid float, otherwise `null`.
 *                            If the string cannot be parsed as a valid float, the function returns `null`.
 *
 * Example usage:
 * const result = convertStringToFloat("3.14"); // Outputs: 3.14
 * const invalidResult = convertStringToFloat("abc"); // Outputs: null
 */
export function convertStringToFloat(text: string): number | null {
	return !isNaN(parseFloat(text)) ? parseFloat(text) : null;
}

/**
 * Converts a valid string to an integer number.
 *
 * This function attempts to parse a given string into an integer.
 * If the string represents a valid integer, the corresponding number is returned.
 * If the string is not a valid integer, `null` is returned.
 *
 * @param {string} text - The string to be converted into an integer.
 *
 * @returns {number | null} - An integer if the string is a valid integer, otherwise `null`.
 *                            If the string cannot be parsed as a valid integer, the function returns `null`.
 *
 * Example usage:
 * const result = convertStringToInt("42"); // Outputs: 42
 * const invalidResult = convertStringToInt("3.14"); // Outputs: null
 */
export function convertStringToInt(text: string): number | null {
	return !isNaN(parseInt(text)) ? parseInt(text) : null;
}
