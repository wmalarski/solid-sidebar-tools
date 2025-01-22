import { type Component, createMemo, For } from "solid-js";
import { Flex, Grid } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Heading } from "~/ui/heading";
import {
  CardButtonAddCookieDialog,
  IconButtonAddCookieDialog,
} from "./add-cookie-dialog";
import { CookieCard } from "./cookie-card";
import { useCookiesContext } from "./cookies-context";

export const CookiesPanel: Component = () => {
  const { t } = useI18n();

  const cookiesContext = useCookiesContext();

  const tabCookiesMap = createMemo(() => {
    const tabCookies = cookiesContext().tabCookies();
    const entries = tabCookies.map((cookie) => [cookie.name, cookie] as const);
    return new Map(entries);
  });

  return (
    <Flex flexDirection="column" px={2} gap={4}>
      <Grid gridTemplateColumns="1fr auto" gap={4} alignItems="center">
        <Heading fontSize="lg">{t("cookies.list.cookies")}</Heading>
        <IconButtonAddCookieDialog />
      </Grid>
      <Flex flexDirection="column" gap={4}>
        <For
          each={cookiesContext().cookies()}
          fallback={<CardButtonAddCookieDialog />}
        >
          {(cookie) => (
            <CookieCard
              cookie={cookie}
              tabCookie={tabCookiesMap().get(cookie.name)}
            />
          )}
        </For>
      </Flex>
    </Flex>
  );
};
