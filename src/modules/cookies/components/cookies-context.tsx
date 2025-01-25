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
import type { ConfigFormData } from "~/modules/configs/components/cookie-form";
import { getChromeTabCookies } from "../services/cookies";
import {
  type SavedCookie,
  getSavedCookies,
  onSavedCookiesChange,
  setSavedCookies,
} from "../services/storage";
import { onCurrentUrlChange } from "../services/tabs";

const createCookiesContext = () => {
  const [url, setUrl] = createSignal<string>("");
  const [tabCookies, setTabCookies] = createSignal<chrome.cookies.Cookie[]>([]);
  const [idCounter, setIdCounter] = createSignal(0);
  const [cookies, setCookies] = createSignal<SavedCookie[]>([]);

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

  const addCookie = async (data: ConfigFormData) => {
    const id = idCounter();
    setIdCounter((current) => current + 1);
    const updated = [...cookies(), { id, ...data }];
    await setSavedCookies(url(), updated);
  };

  const updateCookie = async (id: number, data: ConfigFormData) => {
    const newEntry = { id, ...data };
    await setSavedCookies(
      url(),
      cookies().map((entry) => (entry.id === id ? newEntry : entry)),
    );
  };

  const removeCookie = async (id: number) => {
    const updated = cookies().filter((entry) => entry.id !== id);
    await setSavedCookies(url(), updated);
  };

  onSavedCookiesChange(url, setCookies);

  return {
    url,
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
