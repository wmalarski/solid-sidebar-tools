import type { ListCollection } from "@ark-ui/solid";
import { type Component, type ComponentProps, For, createMemo } from "solid-js";
import { Flex } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Checkbox } from "~/ui/checkbox";
import { Collapsible } from "~/ui/collapsible";
import { Field } from "~/ui/field";
import { CheckIcon } from "~/ui/icons/check-icon";
import { ChevronsUpDownIcon } from "~/ui/icons/chevrons-up-down-icon";
import { Select, createListCollection } from "~/ui/select";

export const CookieAdvancedFields: Component<{
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  cookie?: chrome.cookies.Cookie;
}> = (props) => {
  const { t } = useI18n();

  const onOpenChange: ComponentProps<typeof Collapsible.Root>["onOpenChange"] =
    (details) => {
      props.onOpenChange(details.open);
    };

  return (
    <Collapsible.Root open={props.isOpen} onOpenChange={onOpenChange}>
      <Collapsible.Content>
        <Flex flexDirection="column" gap={4}>
          <Field.Root w="full">
            <Field.Label>{t("cookies.form.domain")}</Field.Label>
            <Field.Input
              size="xs"
              placeholder={t("cookies.form.domain")}
              value={props.cookie?.domain}
              name="domain"
              autocomplete="off"
            />
          </Field.Root>
          <Field.Root w="full">
            <Field.Label>{t("cookies.form.expirationDate")}</Field.Label>
            <Field.Input
              size="xs"
              placeholder={t("cookies.form.expirationDate")}
              value={props.cookie?.expirationDate}
              name="expirationDate"
              autocomplete="off"
            />
          </Field.Root>
          <Checkbox checked={props.cookie?.httpOnly} name="httpOnly" size="sm">
            {t("cookies.form.httpOnly")}
          </Checkbox>
          <Field.Root w="full">
            <Field.Label>{t("cookies.form.path")}</Field.Label>
            <Field.Input
              size="xs"
              placeholder={t("cookies.form.path")}
              value={props.cookie?.path}
              name="path"
              autocomplete="off"
            />
          </Field.Root>
          <SameSiteSelect />
          <Checkbox checked={props.cookie?.secure} name="secure" size="sm">
            {t("cookies.form.secure")}
          </Checkbox>
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

const SameSiteSelect: Component = () => {
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
