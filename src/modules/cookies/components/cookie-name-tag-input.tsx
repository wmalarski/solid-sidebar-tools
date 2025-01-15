import { createAsync } from "@solidjs/router";
import { type Component, createSignal, For } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Combobox, createListCollection } from "~/ui/combobox";
import { IconButton } from "~/ui/icon-button";
import { Input } from "~/ui/input";

const data = [
  { label: "React", value: "react" },
  { label: "Solid", value: "solid" },
  { label: "Svelte", value: "svelte", disabled: true },
  { label: "Vue", value: "vue" },
];

export const CookieNameTagInput: Component = () => {
  const { t } = useI18n();

  const cookies = createAsync(() => {
    return Promise.resolve(["test-cookie-123"]);
  });

  const [items, setItems] = createSignal(data);
  const collection = createListCollection({ items: data });

  const handleChange = (e: Combobox.InputValueChangeDetails) => {
    const filtered = data.filter((item) =>
      item.label.toLowerCase().includes(e.inputValue.toLowerCase()),
    );
    setItems(filtered.length > 0 ? filtered : data);
  };

  return (
    <Combobox.Root
      width="2xs"
      onInputValueChange={handleChange}
      collection={collection}
    >
      <Combobox.Label>Framework</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input
          placeholder="Select a Framework"
          asChild={(inputProps) => <Input {...inputProps()} />}
        />
        <Combobox.Trigger
          asChild={(triggerProps) => (
            <IconButton
              variant="link"
              aria-label="open"
              size="xs"
              {...triggerProps()}
            >
              <ChevronsUpDownIcon />
            </IconButton>
          )}
        />
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <Combobox.ItemGroup>
            <Combobox.ItemGroupLabel>Frameworks</Combobox.ItemGroupLabel>
            <For each={items()}>
              {(item) => (
                <Combobox.Item item={item}>
                  <Combobox.ItemText>{item.label}</Combobox.ItemText>
                  <Combobox.ItemIndicator>
                    <CheckIcon />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </For>
          </Combobox.ItemGroup>
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  );
};
