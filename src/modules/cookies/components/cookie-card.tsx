import { decode } from "decode-formdata";
import {
  createMemo,
  createSignal,
  type Component,
  type ComponentProps,
} from "solid-js";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import { Field } from "~/ui/field";
import { RadioGroup } from "~/ui/radio-group";
import type { CookieFormData } from "./cookie-form";

const CUSTOM_VALUE = "__custom__";

type CookieCardProps = {
  cookie: CookieFormData;
};

export const CookieCard: Component<CookieCardProps> = (props) => {
  const { t } = useI18n();

  const formId = createMemo(() => `cookie-form-${props.cookie.name}`);
  const [formRef, setFormRef] = createSignal<HTMLFormElement>();

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
  };

  const onFormSubmit: ComponentProps<"form">["onChange"] = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const parsed = v.safeParse(
      v.object({ value: v.string(), custom: v.optional(v.string()) }),
      decode(formData),
    );

    console.log("parsed", parsed);
  };

  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>{props.cookie.name}</Card.Title>
        <Card.Description>
          {t("cookies.list.cardDescription", { name: props.cookie.name })}
        </Card.Description>
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
        <Button form={formId()}>{t("common.save")}</Button>
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
          <RadioGroup.ItemHiddenInput />
        </RadioGroup.Item>
      ))}
      <RadioGroup.Item value={CUSTOM_VALUE}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>{t("cookies.list.custom")}</RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput />
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
