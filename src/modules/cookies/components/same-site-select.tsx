import type { ListCollection } from "@ark-ui/solid";
import { type Component, For, createMemo } from "solid-js";
import { CheckIcon } from "~/ui/icons/check-icon";
import { ChevronsUpDownIcon } from "~/ui/icons/chevrons-up-down-icon";
import { Select, createListCollection } from "~/ui/select";

export const SameSiteSelect: Component = () => {
  const collection = createMemo(
    () =>
      createListCollection({
        items: [
          { label: "React", value: "react" },
          { label: "Solid", value: "solid" },
          { label: "Svelte", value: "svelte" },
          { label: "Vue", value: "vue" },
        ],
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      }) as unknown as ListCollection<any>,
  );

  return (
    <Select.Root
      name="sameSite"
      positioning={{ sameWidth: true }}
      width="2xs"
      collection={collection()}
    >
      <Select.Label>Framework</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select a Framework" />
          <ChevronsUpDownIcon />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <Select.ItemGroup>
            <Select.ItemGroupLabel>Framework</Select.ItemGroupLabel>
            <For each={collection().items}>
              {(item) => (
                <Select.Item item={item}>
                  <Select.ItemText>{item.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              )}
            </For>
          </Select.ItemGroup>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
