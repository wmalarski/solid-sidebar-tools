import type { Component } from "solid-js";
import {
  type Accessor,
  type ParentProps,
  createContext,
  createMemo,
  createResource,
  createSignal,
  onCleanup,
  useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  getChromeTabCookies,
  getCurrentChromeTabUrl,
  getSavedCookies,
  onCurrentUrlChange,
} from "../services/chrome";
import type { CookieFormData } from "./cookie-form";

export type CookieValue = {
  id: number;
  name: string;
  values: string[];
};

const createCookiesContext = () => {
  const [url, { mutate }] = createResource(() => getCurrentChromeTabUrl());
  const subscription = onCurrentUrlChange(mutate);
  onCleanup(() => subscription());

  const [tabCookies] = createResource(() => {
    const resolvedUrl = url();
    return resolvedUrl ? getChromeTabCookies(resolvedUrl) : [];
  });

  const [savedCookies] = createResource(() => {
    const resolvedUrl = url();
    return resolvedUrl ? getSavedCookies(resolvedUrl) : [];
  });

  const store = createMemo(() => {
    const initialData = savedCookies() ?? [];
    const [idCounter, setIdCounter] = createSignal(initialData.length);

    const [cookies, setCookies] = createStore<CookieValue[]>(
      initialData.map((entry, index) => ({ id: index, ...entry })),
    );

    return { idCounter, setIdCounter, cookies, setCookies };
  });

  const addCookie = (data: CookieFormData) => {
    const resolvedStore = store();
    const id = resolvedStore.idCounter();
    resolvedStore.setCookies(
      produce((current) => current.push({ id, ...data })),
    );
    resolvedStore.setIdCounter((current) => current + 1);
  };

  const updateCookie = (id: number, data: CookieFormData) => {
    const resolvedStore = store();
    resolvedStore.setCookies(
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
    const resolvedStore = store();
    resolvedStore.setCookies(
      produce((current) => {
        const entryIndex = current.findIndex((entry) => entry.id === id);
        if (entryIndex >= 0) {
          current.splice(entryIndex, 1);
        }
      }),
    );
  };

  return {
    get cookies() {
      return store().cookies;
    },
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
