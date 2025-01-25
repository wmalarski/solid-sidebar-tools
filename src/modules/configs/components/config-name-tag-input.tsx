import { type Component, For, createMemo, createSignal } from "solid-js";
import { css } from "styled-system/css";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Combobox, createListCollection } from "~/ui/combobox";
import { IconButton } from "~/ui/icon-button";
import { CheckIcon } from "~/ui/icons/check-icon";
import { ChevronsUpDownIcon } from "~/ui/icons/chevrons-up-down-icon";
import { Input } from "~/ui/input";

export type ConfigValues = {
  name: string;
  value: string;
};

type ConfigNameTagInputProps = {
  initialValue?: string;
  configValues: ConfigValues[];
  onValueChange: (value: string) => void;
};

export const ConfigNameTagInput: Component<ConfigNameTagInputProps> = (
  props,
) => {
  const { t } = useI18n();

  const data = createMemo(() =>
    props.configValues.map((entry) => ({
      label: entry.name,
      value: entry.name,
    })),
  );

  const items = createMemo(() => {
    const [items, setItems] = createSignal(data());
    return { get: items, set: setItems };
  });

  const collection = createMemo(() => createListCollection({ items: data() }));

  const onInputValueChange: Combobox.RootProps["onInputValueChange"] = (
    details,
  ) => {
    const untrackedData = data();
    const query = details.inputValue.toLowerCase();

    const filtered = untrackedData.filter((item) =>
      item.label.toLowerCase().includes(query),
    );
    items().set(filtered.length > 0 ? filtered : untrackedData);
  };

  const onValueChange: Combobox.RootProps["onValueChange"] = (details) => {
    const value = details.value[0]?.toLowerCase();
    const selectedValue = props.configValues.find((entry) =>
      entry.name.toLowerCase().includes(value),
    );

    if (selectedValue) {
      props.onValueChange(selectedValue.value);
    }
  };

  return (
    <Combobox.Root
      width="2xs"
      size="sm"
      onInputValueChange={onInputValueChange}
      onValueChange={onValueChange}
      collection={collection()}
      allowCustomValue
      inputValue={props.initialValue}
    >
      <Combobox.Label>{t("configs.form.name")}</Combobox.Label>
      <Combobox.Control>
        <Combobox.Input
          size="xs"
          placeholder={t("configs.form.selectName")}
          asChild={(inputProps) => <Input {...inputProps()} />}
          name="name"
          autofocus
        />
        <Combobox.Trigger
          asChild={(triggerProps) => (
            <IconButton variant="link" size="xs" {...triggerProps()}>
              <span class={css({ srOnly: true })}>{t("common.open")}</span>
              <ChevronsUpDownIcon />
            </IconButton>
          )}
        />
      </Combobox.Control>
      <Combobox.Positioner>
        <Combobox.Content>
          <For each={items().get()}>
            {(item) => (
              <Combobox.Item item={item}>
                <Combobox.ItemText>{item.label}</Combobox.ItemText>
                <Combobox.ItemIndicator>
                  <CheckIcon />
                </Combobox.ItemIndicator>
              </Combobox.Item>
            )}
          </For>
        </Combobox.Content>
      </Combobox.Positioner>
    </Combobox.Root>
  );
};
