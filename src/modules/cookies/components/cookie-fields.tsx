import { createMemo, createSignal, For, type Component } from "solid-js";
import { Flex } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { FormLabel } from "~/ui/form-label";
import { Input } from "~/ui/input";
import { CookieNameTagInput } from "./cookie-name-tag-input";

type CookieFieldsData = {
  name: string;
  values: string[];
};

type CookieFieldProps = {
  initialReview?: CookieFieldsData;
};

const createCookieInputsState = (initialValues: string[] = []) => {
  const [inputId, setInputId] = createSignal(initialValues.length);

  const [entries, setEntries] = createSignal(
    initialValues.map((value, index) => ({ value, id: index })),
  );

  const addInput = () => {
    const nextId = inputId();
    setEntries((current) => [...current, { id: nextId, value: "" }]);
    setInputId((current) => current + 1);
  };

  const removeInput = (id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return { entries, addInput, removeInput };
};

export const CookieFields: Component<CookieFieldProps> = (props) => {
  const { t } = useI18n();

  const inputsState = createMemo(() =>
    createCookieInputsState(props.initialReview?.values),
  );

  return (
    <Flex flexDirection="column" padding="4">
      <CookieNameTagInput />
      <For each={inputsState().entries()}>
        {(entry) => (
          <FormLabel>
            {t("ReviewForm.textLabel")}
            <Input name="text" value={props.initialReview?.text ?? ""} />
          </FormLabel>
        )}
      </For>
      {/* <FormLabel>
        {t("ReviewForm.textLabel")}
        <Input name="text" value={props.initialReview?.text ?? ""} />
      </FormLabel>
      <FormLabel>
        {t("ReviewForm.rateLabel")}
        <NumberInput
          name="rate"
          min={0}
          max={10}
          step={0.1}
          value={String(props.initialReview?.rate ?? 5)}
        />
      </FormLabel> */}
    </Flex>
  );
};
