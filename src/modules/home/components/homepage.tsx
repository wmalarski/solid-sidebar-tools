import { type Component, For, createMemo } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { CookiesContextProvider } from "~/modules/cookies/components/cookies-context";
import { CookiesPanel } from "~/modules/cookies/components/cookies-panel";
import { Heading } from "~/ui/heading";
import { Tabs } from "~/ui/tabs";

export const Homepage: Component = () => {
  const { t } = useI18n();

  const options = createMemo(() => [
    { id: "cookies", label: t("cookies.list.cookies") },
  ]);

  return (
    <main>
      <Tabs.Root defaultValue="cookies" pt={2}>
        <Tabs.List>
          <Heading as="h1" flexGrow={1} pl={2} fontSize="xl">
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
          <CookiesContextProvider>
            <CookiesPanel />
          </CookiesContextProvider>
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
};
