import { type Component, For, createMemo } from "solid-js";
import { Flex, Grid } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { useSavedConfigsContext } from "~/modules/configs/contexts/saved-configs";
import { Heading } from "~/ui/heading";
import { ConfigCard } from "../../configs/components/config-card";
import {
  CardButtonAddCookieDialog,
  IconButtonAddCookieDialog,
} from "./add-cookie-dialog";
import { useCookiesContext } from "./cookies-context";

export const CookiesPanel: Component = () => {
  const { t } = useI18n();

  const savedCookies = useSavedConfigsContext();
  const cookiesContext = useCookiesContext();

  const tabCookiesMap = createMemo(() => {
    const tabCookies = cookiesContext().tabCookies;
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
          each={savedCookies().get()}
          fallback={<CardButtonAddCookieDialog />}
        >
          {(cookie) => (
            <ConfigCard
              config={cookie}
              value={tabCookiesMap().get(cookie.name)?.value}
            />
          )}
        </For>
      </Flex>
    </Flex>
  );
};
