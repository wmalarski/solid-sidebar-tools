import { type Component, type JSX, type ParentProps, Show } from "solid-js";
import { isChromeExtension } from "../services/chrome";

export const ExtensionOnly: Component<
  ParentProps<{ fallback?: JSX.Element }>
> = (props) => {
  const isExtension = isChromeExtension();

  return (
    <Show when={isExtension} fallback={props.fallback}>
      {props.children}
    </Show>
  );
};
