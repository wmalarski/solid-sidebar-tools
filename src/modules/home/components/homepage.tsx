import { type Component, For } from "solid-js";
import { CookiesContextProvider } from "~/modules/cookies/components/cookies-context";
import { CookiesPanel } from "~/modules/cookies/components/cookies-panel";
import { Tabs } from "~/ui/tabs";

const options = [
  { id: "react", label: "React" },
  { id: "solid", label: "Solid" },
  { id: "svelte", label: "Svelte" },
  { id: "vue", label: "Vue" },
];

export const Homepage: Component = () => {
  return (
    <main>
      <Tabs.Root defaultValue="react">
        <Tabs.List>
          <For each={options}>
            {(option) => (
              <Tabs.Trigger value={option.id} disabled={option.id === "svelte"}>
                {option.label}
              </Tabs.Trigger>
            )}
          </For>
          <Tabs.Indicator />
        </Tabs.List>
        <Tabs.Content value="react">
          <CookiesContextProvider>
            <CookiesPanel />
          </CookiesContextProvider>
        </Tabs.Content>
        <Tabs.Content value="solid">Know Solid? Check out Svelte!</Tabs.Content>
        <Tabs.Content value="svelte">Know Svelte? Check out Vue!</Tabs.Content>
        <Tabs.Content value="vue">Know Vue? Check out React!</Tabs.Content>
      </Tabs.Root>
    </main>
  );
};
