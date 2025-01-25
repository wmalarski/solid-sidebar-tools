import { type Component, For, createMemo } from "solid-js";
import { css } from "styled-system/css";
import { ExtensionOnly } from "~/modules/common/components/extension-only";
import { CurrentUrlContextProvider } from "~/modules/common/contexts/current-url";
import { useI18n } from "~/modules/common/contexts/i18n";
import { CookiesContextProvider } from "~/modules/cookies/components/cookies-context";
import { CookiesPanel } from "~/modules/cookies/components/cookies-panel";
import { Heading } from "~/ui/heading";
import { PocketKnifeIcon } from "~/ui/icons/pocket-knife-icon";
import { Tabs } from "~/ui/tabs";

export const Homepage: Component = () => {
  const { t } = useI18n();

  const options = createMemo(() => [
    { id: "cookies", label: t("cookies.list.cookies") },
    { id: "locals", label: t("locals.locals") },
  ]);

  return (
    <main>
      <Tabs.Root defaultValue="cookies" pt={2}>
        <Tabs.List>
          <Heading
            as="h1"
            flexGrow={1}
            display="flex"
            gap={2}
            pl={2}
            pb={2}
            alignItems="center"
            fontSize="xl"
          >
            <PocketKnifeIcon class={css({ color: "colorPalette.default" })} />
            {t("info.title")}
          </Heading>
          <For each={options()}>
            {(option) => (
              <Tabs.Trigger value={option.id}>{option.label}</Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="cookies">
          <ExtensionOnly>
            <CurrentUrlContextProvider>
              <CookiesContextProvider>
                <CookiesPanel />
              </CookiesContextProvider>
            </CurrentUrlContextProvider>
          </ExtensionOnly>
        </Tabs.Content>
        <Tabs.Content value="locals">Hello</Tabs.Content>
      </Tabs.Root>
    </main>
  );
};
