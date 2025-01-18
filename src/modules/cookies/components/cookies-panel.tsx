import { createMemo, createSignal, For, type Component } from "solid-js";
import { Flex } from "styled-system/jsx";
import { AddCookieDialog } from "./add-cookie-dialog";
import type { CookieFormData } from "./cookie-form";

const createCookies = () => {
  const [cookies, setCookies] = createSignal<CookieFormData[]>([]);

  const addCookie = (data: CookieFormData) => {
    setCookies((current) => [...current, data]);
  };

  return { cookies, addCookie };
};

export const CookiesPanel: Component = () => {
  const cookies = createMemo(() => createCookies());

  const onAddCookieSubmit = (data: CookieFormData) => {
    cookies().addCookie(data);
  };

  return (
    <Flex flexDirection="column">
      <AddCookieDialog onSubmit={onAddCookieSubmit} />
      <Flex flexDirection="column" gap={4}>
        <For each={cookies().cookies()}>
          {(cookie) => <pre>{JSON.stringify(cookie, null, 2)}</pre>}
        </For>
      </Flex>
    </Flex>
  );
};
