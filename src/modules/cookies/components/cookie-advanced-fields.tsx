import type { Component, ComponentProps } from "solid-js";
import { Flex } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Checkbox } from "~/ui/checkbox";
import { Collapsible } from "~/ui/collapsible";
import { Field } from "~/ui/field";
import { ExpirationDatePicker } from "./expiration-date-picker";
import { SameSiteSelect } from "./same-site-select";

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
          <ExpirationDatePicker />
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
          <Checkbox checked={props.cookie?.httpOnly} name="httpOnly" size="sm">
            {t("cookies.form.httpOnly")}
          </Checkbox>
          <Checkbox checked={props.cookie?.secure} name="secure" size="sm">
            {t("cookies.form.secure")}
          </Checkbox>
        </Flex>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
