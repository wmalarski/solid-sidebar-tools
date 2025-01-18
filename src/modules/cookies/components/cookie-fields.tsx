import { createMemo, createSignal, For, type Component } from "solid-js";
import { Flex, VStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Field } from "~/ui/field";
import { CookieNameTagInput } from "./cookie-name-tag-input";

type CookieFieldsData = {
  name: string;
  values: string[];
};

type CookieFieldProps = {
  initialReview?: CookieFieldsData;
};

const createCookieInputsState = (initialValues: string[] = []) => {
  const nonEmptyInitialValues =
    initialValues.length === 0 ? [""] : initialValues;

  const [inputId, setInputId] = createSignal(nonEmptyInitialValues.length);

  const [entries, setEntries] = createSignal(
    nonEmptyInitialValues.map((value, index) => ({ value, id: index })),
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

  const onDeleteClickFactory = (id: number) => () => {
    inputsState().removeInput(id);
  };

  return (
    <Flex flexDirection="column" padding="4">
      <CookieNameTagInput />
      <For each={inputsState().entries()}>
        {(entry, index) => (
          <VStack>
            <Field.Root required>
              <Field.Label>
                {t("cookies.form.value", { index: index() })}
              </Field.Label>
              <Field.Input
                placeholder={t("cookies.form.cookieValue")}
                value={entry.value}
              />
            </Field.Root>
            <Button onClick={onDeleteClickFactory(entry.id)}>
              {t("cookies.form.delete")}
            </Button>
          </VStack>
        )}
      </For>
    </Flex>
  );
};
