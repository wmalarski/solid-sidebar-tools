import { type Component, createMemo, For } from "solid-js";
import { Flex, Grid } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { useSavedConfigsContext } from "~/modules/configs/contexts/saved-configs";
import {
  CardButtonAddConfigDialog,
  IconButtonAddConfigDialog,
} from "~/modules/configs/dialogs/add-config-dialog";
import { useCookiesContext } from "~/modules/cookies/contexts/cookies-context";
import { Heading } from "~/ui/heading";
import { ConfigCard } from "./config-card";

export const ConfigsPanel: Component = () => {
  const { t } = useI18n();

  const savedConfigs = useSavedConfigsContext();
  const cookiesContext = useCookiesContext();

  const tabCookiesMap = createMemo(() => {
    const tabCookies = cookiesContext().get();
    const entries = tabCookies.map((cookie) => [cookie.name, cookie] as const);
    return new Map(entries);
  });

  return (
    <Flex flexDirection="column" gap={4} px={2}>
      <Grid alignItems="center" gap={4} gridTemplateColumns="1fr auto">
        <Heading fontSize="lg">{t("configs.list.heading")}</Heading>
        <IconButtonAddConfigDialog kind="cookie" />
      </Grid>
      <Flex flexDirection="column" gap={4}>
        <For
          each={savedConfigs().get()}
          fallback={<CardButtonAddConfigDialog kind="cookie" />}
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
