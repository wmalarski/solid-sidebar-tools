import type { Component } from "solid-js";
import {
  type Accessor,
  createContext,
  createMemo,
  createResource,
  type ParentProps,
  useContext,
} from "solid-js";
import { onCurrentUrlChange } from "~/modules/common/services/tabs";
import { getChromeTabCookies } from "../services/cookies";

const createCookiesContext = () => {
  const [cookies, { refetch }] = createResource(() => getChromeTabCookies());

  const get = createMemo(() => cookies() ?? []);

  onCurrentUrlChange(() => {
    refetch();
  });

  return { get };
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
