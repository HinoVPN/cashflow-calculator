import { computed, ref } from 'vue';
import zhHant from './zh-Hant.js';
import en from './en.js';

const messages = {
  'zh-Hant': zhHant,
  en,
};

const locale = ref('en');

export function useI18n() {
  const t = (key) => {
    const table = messages[locale.value] || messages['zh-Hant'];
    return table[key] ?? messages['zh-Hant'][key] ?? key;
  };

  const setLocale = (next) => {
    if (messages[next]) {
      locale.value = next;
    }
  };

  return {
    locale,
    t,
    setLocale,
    isZh: computed(() => locale.value === 'zh-Hant'),
  };
}
