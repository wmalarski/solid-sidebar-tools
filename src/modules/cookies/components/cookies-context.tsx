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
  const [url, setUrl] = createSignal<string>("");
  const [tabCookies, setTabCookies] = createSignal<chrome.cookies.Cookie[]>([]);
  const [idCounter, setIdCounter] = createSignal(0);
  const [cookies, setCookies] = createStore<CookieValue[]>([]);

  const subscription = onCurrentUrlChange(async (url) => {
    const [tabCookies, savedCookies] = await Promise.all([
      getChromeTabCookies(url),
      getSavedCookies(url),
    ]);

    console.log({ tabCookies, savedCookies });

    console.log({ tabCookies, savedCookies, url });

    const maxId = savedCookies.reduce(
      (previous, current) => Math.max(previous, current.id),
      0,
    );

    console.log({ maxId });

    setUrl(url);
    setTabCookies(tabCookies);
    setCookies(savedCookies);
    setIdCounter(maxId + 1);
  });

  onCleanup(() => subscription());

  const addCookie = async (data: CookieFormData) => {
    const id = idCounter();
    setCookies(produce((current) => current.push({ id, ...data })));
    setIdCounter((current) => current + 1);

    await setSavedCookies(url(), cookies);
    console.log("cookies", JSON.stringify(cookies, null, 2));

    const saved = await getSavedCookies(url());
    console.log("saved", saved);
  };

  const updateCookie = async (id: number, data: CookieFormData) => {
    setCookies(
      produce((current) => {
        const entry = current.find((entry) => entry.id === id);
        if (entry) {
          entry.name = data.name;
          entry.values = data.values;
        }
      }),
    );

    await setSavedCookies(url(), cookies);
    console.log("cookies", JSON.stringify(cookies, null, 2));

    const saved = await getSavedCookies(url());
    console.log("saved", saved);
  };

  const removeCookie = async (id: number) => {
    setCookies(
      produce((current) => {
        const entryIndex = current.findIndex((entry) => entry.id === id);
        if (entryIndex >= 0) {
          current.splice(entryIndex, 1);
        }
      }),
    );

    await setSavedCookies(url(), cookies);
    console.log("cookies", JSON.stringify(cookies, null, 2));

    const saved = await getSavedCookies(url());
    console.log("saved", saved);
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
