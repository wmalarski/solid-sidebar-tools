import { type Component, For } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { CheckIcon } from "~/ui/icons/check-icon";
import { ChevronsUpDownIcon } from "~/ui/icons/chevrons-up-down-icon";
import { Select, createListCollection } from "~/ui/select";

const collection = createListCollection({
  items: [
    { label: "Unspecified", value: "unspecified" },
    { label: "No restriction", value: "no_restriction" },
    { label: "Lax", value: "lax" },
    { label: "Strict", value: "strict" },
  ],
});

export const SameSiteSelect: Component<{
  value?: chrome.cookies.Cookie["sameSite"];
}> = (props) => {
  const { t } = useI18n();

  return (
    <Select.Root
      name="sameSite"
      positioning={{ sameWidth: true }}
      size="sm"
      width="2xs"
      value={props.value ? [props.value] : []}
      collection={collection}
    >
      <Select.Label>{t("cookies.form.sameSite")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={t("cookies.form.sameSite")} />
          <ChevronsUpDownIcon />
        </Select.Trigger>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          <For each={collection.items}>
            {(item) => (
              <Select.Item item={item}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            )}
          </For>
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
};
