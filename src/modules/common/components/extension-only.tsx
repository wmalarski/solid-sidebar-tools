import { type Component, type ParentProps, Show } from "solid-js";
import { isChromeExtension } from "../services/chrome";

export const ExtensionOnly: Component<ParentProps> = (props) => {
  const isExtension = isChromeExtension();

  return <Show when={isExtension}>{props.children}</Show>;
};
