import { useCallback, useEffect, useRef, useState } from 'preact/hooks';

type I18nDict = Record<string, string>;

export interface UseI18nResult {
  t: (key: string, params?: Record<string, any>) => string;
  setLang: (lang: string) => Promise<void>;
  getLang: () => string;
  currentLang: string;
  supported: string[];
  apply: () => void;
}

const DEFAULT_SUPPORTED = ['nl', 'en', 'de', 'fr'];

export default function useI18n(supported: string[] = DEFAULT_SUPPORTED): UseI18nResult {
  const I18N = useRef<I18nDict>({});
  const FALLBACK = useRef<I18nDict>({});
  const cache = useRef<Record<string, I18nDict>>({});
  const [currentLang, setCurrentLang] = useState<string>('en');

  const _loadLang = useCallback(async (lang: string): Promise<I18nDict> => {
    if (cache.current[lang]) return cache.current[lang];
    try {
      const res = await fetch(`/lang/${lang}.json`);
      const data = res.ok ? await res.json() : {};
      cache.current[lang] = data;
      return data;
    } catch (e) {
      cache.current[lang] = {};
      return {};
    }
  }, []);

  const interpolate = useCallback((text: any, params: Record<string, any> = {}) => {
    if (typeof text !== 'string') return text;
    return text.replace(/\{(\w+)\}/g, (_, key) =>
      Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : `{${key}}`,
    );
  }, []);

  const t = useCallback((key: string, params: Record<string, any> = {}) => {
    const value = I18N.current[key] ?? FALLBACK.current[key] ?? key;
    return interpolate(value, params);
  }, [interpolate]);

  const apply = useCallback(() => {
    if (typeof document === 'undefined') return;

    document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((el) => {
      const k = (el.dataset as any).i18n as string | undefined;
      if (!k) return;
      const text = t(k);

      // find first text node child
      let textNode: ChildNode | null = null;
      for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === Node.TEXT_NODE) {
          textNode = el.childNodes[i];
          break;
        }
      }
      if (textNode) textNode.nodeValue = text;
      else el.insertBefore(document.createTextNode(text), el.firstChild);
    });

    document.querySelectorAll<HTMLElement>('[data-i18n-placeholder]').forEach((el) => {
      const k = (el.dataset as any).i18nPlaceholder as string | undefined;
      if (!k) return;
      // @ts-ignore - many elements have placeholder
      (el as any).placeholder = t(k);
    });

    try {
      document.title = t('page.title');
    } catch (e) {
      // ignore
    }
  }, [t]);

  const setLang = useCallback(async (lang: string) => {
    const nextLang = supported.includes(lang) ? lang : 'en';
    const data = await _loadLang(nextLang);
    I18N.current = data;
    setCurrentLang(nextLang);
    localStorage.setItem("io-homecontrol-language", nextLang);
    apply();
    window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: nextLang } }));
  }, [supported, _loadLang, apply]);

  const getLang = useCallback(() => currentLang, [currentLang]);

  // initial load
  useEffect(() => {
    let mounted = true;
    (async () => {
      const saved = localStorage.getItem("io-homecontrol-language");
      const auto = (typeof navigator !== 'undefined' ? (navigator.language || 'en') : 'en').slice(0, 2).toLowerCase();
      const initial = saved || auto;
      const lang = supported.includes(initial) ? initial : 'en';

      // try set select element if present
      try {
        const select = document.getElementById('lang') as HTMLSelectElement | null;
        if (select) select.value = lang;
      } catch (e) {
        // ignore
      }

      if (!mounted) return;

      if (lang === 'en') {
        FALLBACK.current = await _loadLang('en');
        I18N.current = FALLBACK.current;
        setCurrentLang('en');
        localStorage.setItem("io-homecontrol-language", 'en');
        apply();
        window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang: 'en' } }));
      } else {
        const [enData, langData] = await Promise.all([_loadLang('en'), _loadLang(lang)]);
        FALLBACK.current = enData;
        I18N.current = langData;
        setCurrentLang(lang);
        localStorage.setItem("io-homecontrol-language", lang);
        apply();
        window.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
      }
    })();

    return () => {
      mounted = false;
    };
  }, [_loadLang, supported, apply]);


  return { t, setLang, getLang, currentLang, supported } as UseI18nResult;
}
