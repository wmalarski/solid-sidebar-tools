import { createAutoAnimate } from "@formkit/auto-animate/solid";
import { For, type Component } from "solid-js";
import { Flex, Grid } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Text } from "~/ui/text";
import { AddCookieDialog } from "./add-cookie-dialog";
import { CookieCard } from "./cookie-card";
import { useCookiesContext } from "./cookies-context";

export const CookiesPanel: Component = () => {
  const { t } = useI18n();

  const [setParent] = createAutoAnimate({ duration: 100 });

  const cookiesContext = useCookiesContext();

  return (
    <Flex flexDirection="column" px={4} gap={4}>
      <Grid gridTemplateColumns="1fr auto" gap={4} alignItems="center">
        <Text fontWeight="semibold" fontSize="md">
          {t("cookies.list.cookies")}
        </Text>
        <AddCookieDialog />
      </Grid>
      <Flex ref={setParent} flexDirection="column" gap={4}>
        <For each={cookiesContext().cookies}>
          {(cookie) => <CookieCard cookie={cookie} />}
        </For>
      </Flex>
    </Flex>
  );
};
