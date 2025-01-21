import type { Component } from "solid-js";
import {
  type Accessor,
  type ParentProps,
  createContext,
  createMemo,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  getChromeTabCookies,
  getSavedCookies,
  onCurrentUrlChange,
  setSavedCookies,
} from "../services/chrome";
import type { CookieFormData } from "./cookie-form";

export type CookieValue = {
  id: number;
  name: string;
  values: string[];
};

const createCookiesContext = () => {
  const [url, setUrl] = createSignal<string>();
  const [tabCookies, setTabCookies] = createSignal<chrome.cookies.Cookie[]>([]);
  const [idCounter, setIdCounter] = createSignal(0);
  const [cookies, setCookies] = createStore<CookieValue[]>([]);

  const subscription = onCurrentUrlChange(async (url) => {
    const [tabCookies, savedCookies] = await Promise.all([
      getChromeTabCookies(url),
      getSavedCookies(url),
    ]);

    const saved = savedCookies ?? [];
    const initialCookies = saved.map((entry, index) => ({
      id: index,
      ...entry,
    }));

    setUrl(url);
    setTabCookies(tabCookies);
    setCookies(initialCookies);
    setIdCounter(initialCookies.length);
  });

  onCleanup(() => subscription());

  const addCookie = (data: CookieFormData) => {
    const id = idCounter();
    setCookies(produce((current) => current.push({ id, ...data })));
    setIdCounter((current) => current + 1);

    const resolvedUrl = url();
    if (resolvedUrl) {
      setSavedCookies(resolvedUrl, [data]);
    }
  };

  const updateCookie = (id: number, data: CookieFormData) => {
    setCookies(
      produce((current) => {
        const entry = current.find((entry) => entry.id === id);
        if (entry) {
          entry.name = data.name;
          entry.values = data.values;
        }
      }),
    );
  };

  const removeCookie = (id: number) => {
    setCookies(
      produce((current) => {
        const entryIndex = current.findIndex((entry) => entry.id === id);
        if (entryIndex >= 0) {
          current.splice(entryIndex, 1);
        }
      }),
    );
  };

  return {
    cookies,
    tabCookies,
    addCookie,
    updateCookie,
    removeCookie,
  };
};

const CookiesContext = createContext<
  Accessor<ReturnType<typeof createCookiesContext>>
>(() => {
  throw new Error("CookiesContext is not defined");
});

export const CookiesContextProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() => createCookiesContext());

  return (
    <CookiesContext.Provider value={value}>
      {props.children}
    </CookiesContext.Provider>
  );
};

export const useCookiesContext = () => {
  return useContext(CookiesContext);
};
