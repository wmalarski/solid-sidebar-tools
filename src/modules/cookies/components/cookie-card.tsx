import { decode } from "decode-formdata";
import {
  type Component,
  type ComponentProps,
  createMemo,
  createSignal,
} from "solid-js";
import { Flex } from "styled-system/jsx";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import { Field } from "~/ui/field";
import { RadioGroup } from "~/ui/radio-group";
import { saveCookie } from "../services/cookies";
import type { SavedCookie } from "../services/storage";
import { reloadChromeTab } from "../services/tabs";
import { CookieAdvancedFields } from "./cookie-advanced-fields";
import { CookieCardMenu } from "./cookie-card-menu";
import type { CookieFormData } from "./cookie-form";
import { useCookiesContext } from "./cookies-context";

const CUSTOM_VALUE = "__custom__";

type CookieCardProps = {
  cookie: SavedCookie;
  tabCookie?: chrome.cookies.Cookie;
};

export const CookieCard: Component<CookieCardProps> = (props) => {
  const { t } = useI18n();

  const cookiesContext = useCookiesContext();
  const formId = createMemo(() => `cookie-form-${props.cookie.name}`);

  const [isDirty, setIsDirty] = createSignal(false);
  const [showAdvanced, setShowAdvanced] = createSignal(false);

  const onFormChange = () => {
    setIsDirty(true);
  };

  const onFormSubmit: ComponentProps<"form">["onChange"] = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const parsed = v.safeParse(
      v.object({ value: v.string(), custom: v.optional(v.string()) }),
      decode(formData),
    );

    setIsDirty(false);

    if (!parsed.success) {
      return;
    }

    await saveCookie({
      url: cookiesContext().url(),
      name: props.cookie.name,
      value: parsed.output.value,
    });

    await reloadChromeTab();
  };

  const onShowAdvancedClick = () => {
    setShowAdvanced((current) => !current);
  };

  return (
    <Card.Root>
      <Card.Header p={3} display="grid" gridTemplateColumns="1fr auto">
        <Flex flexDirection="column" gap="2">
          <Card.Title>{props.cookie.name}</Card.Title>
          <Card.Description>
            {t("cookies.list.cardDescription", { name: props.cookie.name })}
          </Card.Description>
        </Flex>
        <CookieCardMenu
          cookie={props.cookie}
          onShowAdvancedClick={onShowAdvancedClick}
          showAdvanced={showAdvanced()}
        />
      </Card.Header>
      <Card.Body px={3} pb={2}>
        <form
          id={formId()}
          class={flex({ flexDirection: "column", gap: 4 })}
          onChange={onFormChange}
          onSubmit={onFormSubmit}
        >
          <CookieCardFields cookie={props.cookie} tabCookie={props.tabCookie} />
          <CookieAdvancedFields
            isOpen={showAdvanced()}
            onOpenChange={setShowAdvanced}
          />
        </form>
      </Card.Body>
      <Card.Footer px={3} pt={1} pb={3} gap="3">
        <Button size="xs" disabled={!isDirty()} form={formId()}>
          {t("common.save")}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

type CookieCardFieldsProps = {
  cookie: SavedCookie;
  tabCookie?: chrome.cookies.Cookie;
};

const CookieCardFields: Component<CookieCardFieldsProps> = (props) => {
  const [inputRef, setInputRef] = createSignal<HTMLInputElement>();

  const [isCustomSelected, setIsCustomSelected] = createSignal(false);

  const onValueChange = (value: string) => {
    const isCustom = value === CUSTOM_VALUE;
    setIsCustomSelected(isCustom);

    if (isCustom) {
      inputRef()?.focus();
    }
  };

  return (
    <>
      <CookieRadioValues
        cookie={props.cookie}
        tabCookie={props.tabCookie}
        onValueChange={onValueChange}
      />
      <CustomValueField
        ref={setInputRef}
        isCustom={isCustomSelected()}
        tabCookie={props.tabCookie}
      />
    </>
  );
};

type CookieRadioValuesProps = {
  cookie: CookieFormData;
  tabCookie?: chrome.cookies.Cookie;
  onValueChange: (value: string) => void;
};

const CookieRadioValues: Component<CookieRadioValuesProps> = (props) => {
  const { t } = useI18n();

  const value = createMemo(() => {
    const value = props.tabCookie?.value;
    if (!value) {
      return null;
    }

    const isPredefined = props.cookie.values.includes(value);
    return isPredefined ? value : CUSTOM_VALUE;
  });

  const onValueChange: RadioGroup.RootProps["onValueChange"] = (details) => {
    props.onValueChange(details.value);
  };

  return (
    <RadioGroup.Root
      name="value"
      size="sm"
      value={value()}
      onValueChange={onValueChange}
    >
      {props.cookie.values.map((option) => (
        <RadioGroup.Item value={option}>
          <RadioGroup.ItemControl />
          <RadioGroup.ItemText>{option}</RadioGroup.ItemText>
          <RadioGroup.ItemHiddenInput required />
        </RadioGroup.Item>
      ))}
      <RadioGroup.Item value={CUSTOM_VALUE}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>{t("cookies.list.custom")}</RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput required />
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

type CustomValueFieldProps = {
  isCustom: boolean;
  tabCookie?: chrome.cookies.Cookie;
  ref: Field.InputProps["ref"];
};

const CustomValueField: Component<CustomValueFieldProps> = (props) => {
  const { t } = useI18n();

  return (
    <Field.Root required w="full">
      <Field.Input
        ref={props.ref}
        placeholder={t("cookies.form.cookieValue")}
        name="custom"
        size="xs"
        aria-label={t("cookies.list.custom")}
        autocomplete="off"
        disabled={!props.isCustom}
        required={props.isCustom}
        value={props.isCustom ? props.tabCookie?.value : ""}
      />
    </Field.Root>
  );
};
