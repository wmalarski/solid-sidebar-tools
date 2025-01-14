import type { Component, ParentProps } from "solid-js";
import { TopNavbar } from "./top-navbar";

export const MainLayout: Component<ParentProps> = (props) => {
  return (
    <main>
      <TopNavbar />
      {props.children}
    </main>
  );
};
