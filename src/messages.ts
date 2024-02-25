type MessageJson = Record<string, string>;
type MessageModule = { default: MessageJson };

/** Import git-checked messages */
const importMessages = (locale: string): Promise<MessageModule> => {
  return import(`src/locales/${locale}.json`);
};

const locales = [
  'ar', 'ast', 'bg', 'bn', 'br', 'ca', 'co', 'cs', 'cy', 'da',
  'de', 'el', 'en', 'en-Shaw', 'eo', 'es-AR', 'es', 'et', 'eu',
  'fa', 'fi', 'fr', 'ga', 'gl', 'he', 'hi', 'hr', 'hu', 'hy',
  'id', 'io', 'is', 'it', 'ja', 'ka', 'kk', 'ko', 'lt', 'lv',
  'mk', 'ms', 'nl', 'nn', 'no', 'oc', 'pl', 'pt-BR', 'pt', 'ro',
  'ru', 'sk', 'sl', 'sq', 'sr', 'sr-Latn', 'sv', 'ta', 'te',
  'th', 'tr', 'uk', 'zh-CN', 'zh-HK', 'zh-TW',
] as const;

/** Soapbox locales map */
const messages = locales.reduce((acc, locale) => {
  acc[locale] = () => importMessages(locale).then(module => module.default);
  return acc;
}, {} as Record<string, () => Promise<MessageJson>>);

export default messages;
export { locales };
