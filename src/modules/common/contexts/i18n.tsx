import { flatten, resolveTemplate, translator } from "@solid-primitives/i18n";
import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  createSignal,
  type ParentProps,
  useContext,
} from "solid-js";

const enDict = {
  common: {
    cancel: "Cancel",
    clear: "Clear",
    closeDialog: "Close dialog",
    confirm: "Confirm",
    delete: "Delete",
    loading: "Loading...",
    next: "Next",
    open: "Open",
    openDatePicker: "Open date picker",
    options: "Options",
    previous: "Previous",
    reset: "Reset",
    save: "Save",
    success: "Success",
    update: "Update",
  },
  configs: {
    card: {
      deleteDescription: "Delete config",
      description: "Set '{{name}}' value",
      hideAdvanced: "Hide advanced",
      showAdvanced: "Show advanced",
    },
    dialogs: {
      addNewCookie: "Add new cookie",
      addNewLocal: "Add new localStorage config",
      updateConfig: "Update",
    },
    fields: {
      clear: "Empty",
      custom: "Custom value",
      value: "Value",
    },
    form: {
      addValue: "Add value",
      name: "Name",
      selectName: "Select name",
      value: "Value",
      values: "Values",
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
