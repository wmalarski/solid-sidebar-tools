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
    title: "Sidebar Tools",
  },
  common: {
    closeDialog: "Close dialog",
    clear: "Clear",
    open: "Open",
    cancel: "Cancel",
    confirm: "Confirm",
    save: "Save",
    reset: "Reset",
    success: "Success",
    options: "Options",
    delete: "Delete",
    update: "Update",
    loading: "Loading...",
    openDatePicker: "Open date picker",
    previous: "Previous",
    next: "Next",
  },
  configs: {
    fields: {
      value: "Value",
      custom: "Custom value",
      clear: "Clear value",
    },
    dialogs: {
      addNewCookie: "Add new cookie",
      addNewLocal: "Add new localStorage config",
      updateConfig: "Update",
    },
    form: {
      values: "Values",
      addValue: "Add value",
      value: "Value",
      name: "Name",
      selectName: "Select name",
    },
    card: {
      showAdvanced: "Show advanced",
      hideAdvanced: "Hide advanced",
      deleteDescription: "Delete config",
      description: "Set '{{name}}' value",
    },
    list: {
      heading: "Configs",
    },
  },
  cookies: {
    form: {
      domain: "Domain",
      expirationDate: "Expiration date",
      httpOnly: "HttpOnly",
      path: "Path",
      sameSite: "SameSite",
      secure: "Secure",
    },
  },
};

type Locale = "en";

const dictionaries = { en: enDict };

type Accessed<T> = T extends Accessor<infer A> ? A : never;

const createI18nValue = () => {
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

const I18nContext = createContext<I18nContextValue>({
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
