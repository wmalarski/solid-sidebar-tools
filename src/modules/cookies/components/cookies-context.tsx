import type { Component } from "solid-js";
import {
  type Accessor,
  type ParentProps,
  createContext,
  createMemo,
  createResource,
  onCleanup,
  useContext,
} from "solid-js";
import { useCurrentUrlContext } from "~/modules/common/contexts/current-url";
import type { ConfigFormData } from "~/modules/configs/components/cookie-form";
import {
  getSavedConfig,
  onSavedConfigChange,
  setSavedConfig,
} from "../../configs/services/storage";
import { getChromeTabCookies } from "../services/cookies";

const createCookiesContext = (url: string) => {
  const [tabCookies] = createResource(
    () => url,
    (url) => getChromeTabCookies(url),
  );

  const [cookies, { mutate }] = createResource(
    () => url,
    (url) => getSavedConfig(url),
  );

  const addCookie = async (data: ConfigFormData) => {
    const resolvedCookies = cookies() ?? [];
    const id = resolvedCookies.reduce(
      (previous, current) => Math.max(previous, current.id),
      0,
    );

    const updated = [
      ...resolvedCookies,
      { id, ...data, kind: "cookie" } as const,
    ];
    await setSavedConfig(url, updated);
  };

  const updateCookie = async (id: number, data: ConfigFormData) => {
    const newEntry = { id, ...data, kind: "cookie" } as const;
    const resolvedCookies = cookies() ?? [];
    const updated = resolvedCookies.map((entry) =>
      entry.id === id ? newEntry : entry,
    );
    await setSavedConfig(url, updated);
  };

  const removeCookie = async (id: number) => {
    const resolvedCookies = cookies() ?? [];
    const updated = resolvedCookies.filter((entry) => entry.id !== id);
    await setSavedConfig(url, updated);
  };

  const subscription = onSavedConfigChange(url, mutate);
  onCleanup(() => subscription());

  return {
    get savedCookies() {
      return cookies() ?? [];
    },
    get tabCookies() {
      return tabCookies() ?? [];
    },
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
  const currentUrlContext = useCurrentUrlContext();

  const value = createMemo(() =>
    createCookiesContext(currentUrlContext().url()),
  );

  return (
    <CookiesContext.Provider value={value}>
      {props.children}
    </CookiesContext.Provider>
  );
};

export const useCookiesContext = () => {
  return useContext(CookiesContext);
};
