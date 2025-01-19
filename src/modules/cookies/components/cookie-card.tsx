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
import { CookieCardMenu } from "./cookie-card-menu";
import type { CookieFormData } from "./cookie-form";
import type { CookieValue } from "./cookies-context";

const CUSTOM_VALUE = "__custom__";

type CookieCardProps = {
  cookie: CookieValue;
};

export const CookieCard: Component<CookieCardProps> = (props) => {
  const { t } = useI18n();

  const formId = createMemo(() => `cookie-form-${props.cookie.name}`);
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

  const [isDirty, setIsDirty] = createSignal(false);
  const [isCustomSelected, setIsCustomSelected] = createSignal(false);

  const onFormChange: ComponentProps<"form">["onChange"] = (event) => {
    const formData = new FormData(event.currentTarget);
    const isCustom = formData.get("value") === CUSTOM_VALUE;
    setIsCustomSelected(isCustom);

    if (isCustom) {
      formRef()
        ?.querySelector<HTMLInputElement>("input[name='custom']")
        ?.focus();
    }

    setIsDirty(true);
  };

  const onFormSubmit: ComponentProps<"form">["onChange"] = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const parsed = v.safeParse(
      v.object({ value: v.string(), custom: v.optional(v.string()) }),
      decode(formData),
    );

    setIsDirty(false);

    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log("parsed", parsed);
  };

  return (
    <Card.Root>
      <Card.Header display="grid" gridTemplateColumns="1fr auto">
        <Flex flexDirection="column" gap="2">
          <Card.Title>{props.cookie.name}</Card.Title>
          <Card.Description>
            {t("cookies.list.cardDescription", { name: props.cookie.name })}
          </Card.Description>
        </Flex>
        <CookieCardMenu cookie={props.cookie} />
      </Card.Header>
      <Card.Body>
        <form
          id={formId()}
          ref={setFormRef}
          class={flex({ flexDirection: "column", gap: 4 })}
          onChange={onFormChange}
          onSubmit={onFormSubmit}
        >
          <CookieRadioValues cookie={props.cookie} />
          <CustomValueField isCustom={isCustomSelected()} />
        </form>
      </Card.Body>
      <Card.Footer gap="3">
        <Button disabled={!isDirty()} form={formId()}>
          {t("common.save")}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

type CookieRadioValuesProps = {
  cookie: CookieFormData;
};

const CookieRadioValues: Component<CookieRadioValuesProps> = (props) => {
  const { t } = useI18n();

  return (
    <RadioGroup.Root name="value">
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
};

const CustomValueField: Component<CustomValueFieldProps> = (props) => {
  const { t } = useI18n();

  return (
    <Field.Root required w="full">
      <Field.Input
        placeholder={t("cookies.form.cookieValue")}
        name="custom"
        aria-label={t("cookies.list.custom")}
        autocomplete="off"
        disabled={!props.isCustom}
        required={props.isCustom}
      />
    </Field.Root>
  );
};
