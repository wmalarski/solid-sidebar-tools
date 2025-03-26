import type { Component } from "solid-js";
import {
  type Accessor,
  createContext,
  createMemo,
  createResource,
  type ParentProps,
  useContext,
} from "solid-js";
import { useCurrentUrlContext } from "~/modules/common/contexts/current-url";
import { getChromeTabCookies } from "../services/cookies";

const createCookiesContext = (url?: string) => {
  const [cookies] = createResource(
    () => url,
    (url) => (url ? getChromeTabCookies(url) : []),
  );

  const get = createMemo(() => cookies() ?? []);

  return { get };
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
