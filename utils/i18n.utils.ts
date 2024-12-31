import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import english_translation from '@/locales/en/translation.json';
import chinese_simplified_translation from '@/locales/cn_simp/translation.json';
import chinese_traditional_translation from '@/locales/cn_trad/translation.json';

import { Language } from '@/models/enums';

/**
 * Returns the language code corresponding to a given Language enum value.
 *
 * This function converts a provided `Language` enum value into its respective language code string,
 * which can then be used to reference language-specific resources (e.g., translation files).
 *
 * @param {Language} language - The `Language` enum value to convert to a language code.
 *                              It can be one of the following values:
 *                              - `Language.ENGLISH`
 *                              - `Language.SIMPLIFIED_CHINESE`
 *                              - `Language.TRADITIONAL_CHINESE`
 *
 * @returns {string} - A string representing the language code:
 *                      - `'en'` for English.
 *                      - `'cn_simp'` for Simplified Chinese.
 *                      - `'cn_trad'` for Traditional Chinese.
 *                      - Defaults to `'en'` if the provided `language` does not match any predefined values.
 *
 * Example usage:
 * const languageCode = getLanguageFile(Language.SIMPLIFIED_CHINESE);
 * console.log(languageCode); // Outputs: 'cn_simp'
 */
export const getLanguageFile = (language: Language): string => {
	if (language === Language.ENGLISH) {
		return 'en'; // English language code.
	} else if (language === Language.SIMPLIFIED_CHINESE) {
		return 'cn_simp'; // Simplified Chinese language code.
	} else if (language === Language.TRADITIONAL_CHINESE) {
		return 'cn_trad'; // Traditional Chinese language code.
	} else {
		return 'en'; // Default to English if no match is found.
	}
};

const resources = {
	en: {
		translation: english_translation,
	},
	cn_simp: {
		translation: chinese_simplified_translation,
	},
	cn_trad: {
		translation: chinese_traditional_translation,
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: Localization?.getLocales?.()[0]?.languageTag,
	fallbackLng: 'en',
});

export default i18n;
