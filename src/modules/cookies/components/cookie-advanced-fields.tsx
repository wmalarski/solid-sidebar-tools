import type { Component, ComponentProps } from "solid-js";
import { Flex } from "styled-system/jsx";
import * as v from "valibot";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Checkbox } from "~/ui/checkbox";
import { Collapsible } from "~/ui/collapsible";
import { Field } from "~/ui/field";
import { ExpirationDatePicker } from "./expiration-date-picker";
import { SameSiteSelect } from "./same-site-select";

export const createCookieAdvancedFieldsSchema = () => {
  return v.object({
    kind: v.literal("cookie"),
    domain: v.optional(v.string()),
    expirationDate: v.optional(v.nullable(v.number())),
    path: v.optional(v.string()),
    sameSite: v.optional(
      v.union([
        v.literal("unspecified"),
        v.literal("no_restriction"),
        v.literal("lax"),
        v.literal("strict"),
      ]),
    ),
    httpOnly: v.optional(v.boolean()),
    secure: v.optional(v.boolean()),
  });
};

export const createCookieAdvancedFieldsParseInfo = () => {
  return {
    booleans: ["httpOnly", "secure"],
    numbers: ["expirationDate"],
  };
};

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
    <Collapsible.Root
      unmountOnExit
      lazyMount
      open={props.isOpen}
      onOpenChange={onOpenChange}
    >
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
