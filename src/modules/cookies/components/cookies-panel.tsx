import type { Component } from "solid-js";
import { AddCookieDialog } from "./add-cookie-dialog";

export const CookiesPanel: Component = () => {
  return (
    <span>
      <AddCookieDialog />
    </span>
  );
};
