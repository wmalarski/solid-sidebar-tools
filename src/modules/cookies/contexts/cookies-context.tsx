import type { Component } from "solid-js";
import {
  type Accessor,
  type ParentProps,
  createContext,
  createMemo,
  createResource,
  useContext,
} from "solid-js";
import { useCurrentUrlContext } from "~/modules/common/contexts/current-url";
import { getChromeTabCookies } from "../services/cookies";

const createCookiesContext = (url: string) => {
  const [tabCookies] = createResource(
    () => url,
    (url) => getChromeTabCookies(url),
  );

  return {
    get tabCookies() {
      return tabCookies() ?? [];
    },
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
