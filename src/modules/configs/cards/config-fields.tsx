import { type Component, createMemo, createSignal } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Field } from "~/ui/field";
import { RadioGroup } from "~/ui/radio-group";

const CUSTOM_VALUE = "__custom__";

type ConfigFieldsData = {
  name: string;
  values: string[];
};

const ConfigRadioValues: Component<{
  config: ConfigFieldsData;
  value?: string;
  onValueChange: (value: string) => void;
}> = (props) => {
  const { t } = useI18n();

  const value = createMemo(() => {
    const value = props?.value;
    if (!value) {
      return null;
    }

    const isPredefined = props.config.values.includes(value);
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
      {props.config.values.map((option) => (
        <RadioGroup.Item value={option}>
          <RadioGroup.ItemControl minW="4" />
          <RadioGroup.ItemText
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {option}
          </RadioGroup.ItemText>
          <RadioGroup.ItemHiddenInput required />
        </RadioGroup.Item>
      ))}
      <RadioGroup.Item value={CUSTOM_VALUE}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>{t("configs.fields.custom")}</RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput required />
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

const CustomValueField: Component<{
  isCustom: boolean;
  value?: string;
  ref: Field.InputProps["ref"];
}> = (props) => {
  const { t } = useI18n();

  return (
    <Field.Root required w="full">
      <Field.Input
        ref={props.ref}
        placeholder={t("configs.fields.value")}
        name="custom"
        size="xs"
        aria-label={t("configs.fields.custom")}
        autocomplete="off"
        disabled={!props.isCustom}
        required={props.isCustom}
        value={props.isCustom ? props.value : ""}
      />
    </Field.Root>
  );
};

export const ConfigFields: Component<{
  config: ConfigFieldsData;
  value?: string;
}> = (props) => {
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
      <ConfigRadioValues
        config={props.config}
        value={props.value}
        onValueChange={onValueChange}
      />
      <CustomValueField
        ref={setInputRef}
        isCustom={isCustomSelected()}
        value={props.value}
      />
    </>
  );
};
