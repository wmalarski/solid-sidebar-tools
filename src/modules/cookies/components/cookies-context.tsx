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
  const [url, setUrl] = createSignal<string>("");
  const [tabCookies, setTabCookies] = createSignal<chrome.cookies.Cookie[]>([]);
  const [idCounter, setIdCounter] = createSignal(0);
  const [cookies, setCookies] = createSignal<CookieValue[]>([]);

  const subscription = onCurrentUrlChange(async (url) => {
    const [tabCookies, savedCookies] = await Promise.all([
      getChromeTabCookies(url),
      getSavedCookies(url),
    ]);

    const maxId = savedCookies.reduce(
      (previous, current) => Math.max(previous, current.id),
      0,
    );

    setUrl(url);
    setTabCookies(tabCookies);
    setCookies(savedCookies);
    setIdCounter(maxId + 1);
  });

  onCleanup(() => subscription());

  const addCookie = async (data: CookieFormData) => {
    const id = idCounter();
    const newEntry = { id, ...data };
    setCookies((current) => [...current, newEntry]);
    setIdCounter((current) => current + 1);

    await setSavedCookies(url(), cookies());
  };

  const updateCookie = async (id: number, data: CookieFormData) => {
    const updatedEntry = { id, ...data };
    setCookies((current) =>
      current.map((entry) => (entry.id === id ? updatedEntry : entry)),
    );

    await setSavedCookies(url(), cookies());
  };

  const removeCookie = async (id: number) => {
    setCookies((current) => current.filter((entry) => entry.id !== id));

    await setSavedCookies(url(), cookies());
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
