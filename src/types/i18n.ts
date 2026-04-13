export type LanguageCode = 'en' | 'hi';

export type LocalizedString = Record<LanguageCode, string>;

export function getLocalizedValue(
  value: LocalizedString,
  language: LanguageCode
) {
  return value[language] ?? value.en;
}

