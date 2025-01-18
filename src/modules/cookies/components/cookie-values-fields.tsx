import { createAutoAnimate } from "@formkit/auto-animate/solid";
import { createMemo, createSignal, For, type Component } from "solid-js";
import { Grid, HStack, VStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Field } from "~/ui/field";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";

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

type CookieValuesFieldsProps = {
  initialValues?: string[];
};

export const CookieValuesFields: Component<CookieValuesFieldsProps> = (
  props,
) => {
  const { t } = useI18n();

  const [setParent] = createAutoAnimate({ duration: 100 });

  const inputsState = createMemo(() =>
    createCookieInputsState(props?.initialValues),
  );

  const onDeleteClickFactory = (id: number) => () => {
    inputsState().removeInput(id);
  };

  const onAddValueClick = () => {
    inputsState().addInput();
  };

  const shouldDisableDelete = createMemo(
    () => inputsState().entries().length < 2,
  );

  const shouldDisableAdd = createMemo(() => inputsState().entries().length > 9);

  return (
    <VStack w="full">
      <Grid
        gap="4"
        w="full"
        gridTemplateColumns="1fr auto"
        alignItems="center"
        fontWeight="semibold"
      >
        {t("cookies.form.cookies")}
        <IconButton
          type="button"
          disabled={shouldDisableAdd()}
          onClick={onAddValueClick}
          variant="outline"
          aria-label={t("cookies.form.addCookieValue")}
        >
          <PlusIcon />
        </IconButton>
      </Grid>
      <VStack ref={setParent} gap="4" w="full">
        <For each={inputsState().entries()}>
          {(entry, index) => (
            <Field.Root required w="full">
              <Field.Label>
                {t("cookies.form.value", { index: index() + 1 })}
              </Field.Label>
              <HStack alignItems="center" justifyContent="center">
                <Field.Input
                  placeholder={t("cookies.form.cookieValue")}
                  value={entry.value}
                  name={`values[${index()}]`}
                  autocomplete="off"
                />
                <IconButton
                  colorPalette="red"
                  type="button"
                  disabled={shouldDisableDelete()}
                  onClick={onDeleteClickFactory(entry.id)}
                  aria-label={t("cookies.form.delete")}
                >
                  <TrashIcon />
                </IconButton>
              </HStack>
            </Field.Root>
          )}
        </For>
      </VStack>
    </VStack>
  );
};
