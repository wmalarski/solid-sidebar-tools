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
import { onCurrentUrlChange } from "../services/tabs";

const createCurrentUrlContext = () => {
  const [url, setUrl] = createSignal<string>();

  const subscription = onCurrentUrlChange(setUrl);
  onCleanup(() => subscription());

  return { url };
};

const CurrentUrlContext = createContext<
  Accessor<ReturnType<typeof createCurrentUrlContext>>
>(() => {
  throw new Error("CurrentUrlContext is not defined");
});

export const CurrentUrlContextProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() => createCurrentUrlContext());

  return (
    <CurrentUrlContext.Provider value={value}>
      {props.children}
    </CurrentUrlContext.Provider>
  );
};

export const useCurrentUrlContext = () => {
  return useContext(CurrentUrlContext);
};
