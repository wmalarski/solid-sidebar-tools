import { createMemo, createSignal, For, type Component } from "solid-js";
import { Flex, Grid } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Text } from "~/ui/text";
import { AddCookieDialog } from "./add-cookie-dialog";
import { CookieCard } from "./cookie-card";
import type { CookieFormData } from "./cookie-form";

const createCookies = () => {
  const [cookies, setCookies] = createSignal<CookieFormData[]>([
    {
      name: "Initial",
      values: ["react", "solid", "vue"],
    },
  ]);

  const addCookie = (data: CookieFormData) => {
    setCookies((current) => [...current, data]);
  };

  return { cookies, addCookie };
};

export const CookiesPanel: Component = () => {
  const { t } = useI18n();

  const cookies = createMemo(() => createCookies());

  const onAddCookieSubmit = (data: CookieFormData) => {
    cookies().addCookie(data);
  };

  return (
    <Flex flexDirection="column" px={4} gap={4}>
      <Grid gridTemplateColumns="1fr auto" gap={4} alignItems="center">
        <Text fontWeight="semibold" fontSize="md">
          {t("cookies.list.cookies")}
        </Text>
        <AddCookieDialog onSubmit={onAddCookieSubmit} />
      </Grid>
      <Flex flexDirection="column" gap={4}>
        <For each={cookies().cookies()}>
          {(cookie) => <CookieCard cookie={cookie} />}
        </For>
      </Flex>
    </Flex>
  );
};
