import { flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import {
  type Accessor,
  type Component,
  type ParentProps,
  createContext,
  createMemo,
  createSignal,
  useContext,
} from "solid-js";

const enDict = {
  error: {
    description: "Something went wrong: {{message}}",
    home: "Home",
    reload: "Reload",
    title: "Error",
  },
  info: {
    madeBy: "Made by wmalarski",
    title: "Solid Side",
  },
  common: {
    closeDialog: "Close dialog",
    clear: "Clear",
    open: "Open",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    reset: "Reset",
  },
  cookies: {
    form: {
      addNewCookie: "Add new cookie",
      addCookieValue: "Add cookie value",
      cookies: "Cookie values:",
      name: "Cookie name",
      selectName: "Select cookie name",
      delete: "Delete value",
      value: "Value {{index}}:",
      cookieValue: "Cookie value",
    },
    list: {
      cookies: "Cookies",
      custom: "Custom value",
      cardDescription: "Set '{{name}}' cookie value",
      options: "Card options",
      delete: "Delete",
    },
  },
};

export type Locale = "en";

const dictionaries = { en: enDict };

type Accessed<T> = T extends Accessor<infer A> ? A : never;

export const createI18nValue = () => {
  const [locale, setLocale] = createSignal<Locale>("en");

  const translate = createMemo(() => {
    const dict = flatten(dictionaries[locale()]);
    return translator(() => dict, resolveTemplate);
  });

  const t: Accessed<typeof translate> = (path, ...args) => {
    return translate()(path, ...args);
  };

  return { locale, setLocale, t };
};

type I18nContextValue = ReturnType<typeof createI18nValue>;

export const I18nContext = createContext<I18nContextValue>({
  locale: () => "en" as const,
  setLocale: () => void 0,
  t: () => {
    throw new Error("Not implemented");
  },
});

export const I18nContextProvider: Component<ParentProps> = (props) => {
  const value = createI18nValue();

  return (
    <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>
  );
};

export const useI18n = () => {
  return useContext(I18nContext);
};
