import { type Component, createMemo, createSignal, For } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Field } from "~/ui/field";
import { RadioGroup } from "~/ui/radio-group";

export const CUSTOM_VALUE = "__custom__";
export const EMPTY_VALUE = "__empty__";

type ConfigFieldsData = {
  name: string;
  values: string[];
};

const ConfigRadioValues: Component<{
  config: ConfigFieldsData;
  value?: string;
  onValueChange: (value: string | null) => void;
}> = (props) => {
  const { t } = useI18n();

  const getInitialValue = (value?: string) => {
    if (!value || value.length === 0) {
      return EMPTY_VALUE;
    }
    const isPredefined = props.config.values.includes(value);
    return isPredefined ? value : CUSTOM_VALUE;
  };

  const value = createMemo(() => {
    const [get, set] = createSignal(getInitialValue(props.value));
    return { get, set };
  });

  const onValueChange: RadioGroup.RootProps["onValueChange"] = (details) => {
    details.value && value()?.set(details.value);
    props.onValueChange(details.value);
  };

  return (
    <RadioGroup.Root
      name="value"
      onValueChange={onValueChange}
      size="sm"
      value={value()?.get()}
    >
      <RadioGroup.Item value={EMPTY_VALUE}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>{t("configs.fields.clear")}</RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput required />
      </RadioGroup.Item>

      <For each={props.config.values}>
        {(option) => (
          <RadioGroup.Item value={option}>
            <RadioGroup.ItemControl minW="4" />
            <RadioGroup.ItemText
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
            >
              {option}
            </RadioGroup.ItemText>
            <RadioGroup.ItemHiddenInput required />
          </RadioGroup.Item>
        )}
      </For>

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
        aria-label={t("configs.fields.custom")}
        autocomplete="off"
        disabled={!props.isCustom}
        name="custom"
        placeholder={t("configs.fields.value")}
        ref={props.ref}
        required={props.isCustom}
        size="xs"
        value={props.isCustom && props.value ? props.value : ""}
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

  const onValueChange = (value: string | null) => {
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
        onValueChange={onValueChange}
        value={props.value}
      />
      <CustomValueField
        isCustom={isCustomSelected()}
        ref={setInputRef}
        value={props.value}
      />
    </>
  );
};
