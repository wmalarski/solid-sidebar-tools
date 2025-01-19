import { createAutoAnimate } from "@formkit/auto-animate/solid";
import { type Component, For, createMemo, createSignal } from "solid-js";
import { Grid, HStack, VStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Field } from "~/ui/field";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { SimpleTooltip } from "~/ui/styled/tooltip";

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

  const [setParent] = createAutoAnimate({ duration: 150 });

  const [listRef, setListRef] = createSignal<HTMLElement>();

  const inputsState = createMemo(() =>
    createCookieInputsState(props?.initialValues),
  );

  const onDeleteClickFactory = (id: number) => () => {
    inputsState().removeInput(id);
  };

  const onAddValueClick = () => {
    inputsState().addInput();

    const allInputs = listRef()?.querySelectorAll("input");
    const lastInput = allInputs?.values().toArray().at(-1);
    lastInput?.focus();
  };

  const shouldDisableDelete = createMemo(
    () => inputsState().entries().length < 2,
  );

  const shouldDisableAdd = createMemo(() => inputsState().entries().length > 9);

  return (
    <VStack ref={setListRef} w="full">
      <Grid
        gap="4"
        w="full"
        gridTemplateColumns="1fr auto"
        alignItems="center"
        fontWeight="semibold"
      >
        {t("cookies.form.cookies")}
        <SimpleTooltip
          asChild={(tooltipProps) => (
            <IconButton
              type="button"
              size="xs"
              disabled={shouldDisableAdd()}
              variant="outline"
              aria-label={t("cookies.form.addCookieValue")}
              {...tooltipProps({ onClick: onAddValueClick })}
            >
              <PlusIcon />
            </IconButton>
          )}
        >
          {t("cookies.form.addCookieValue")}
        </SimpleTooltip>
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
                  size="xs"
                  placeholder={t("cookies.form.cookieValue")}
                  value={entry.value}
                  name={`values[${index()}]`}
                  autocomplete="off"
                />
                <SimpleTooltip
                  asChild={(tooltipProps) => (
                    <IconButton
                      colorPalette="red"
                      type="button"
                      size="xs"
                      disabled={shouldDisableDelete()}
                      aria-label={t("cookies.form.delete")}
                      {...tooltipProps({
                        onClick: onDeleteClickFactory(entry.id),
                      })}
                    >
                      <TrashIcon />
                    </IconButton>
                  )}
                >
                  {t("cookies.form.delete")}
                </SimpleTooltip>
              </HStack>
            </Field.Root>
          )}
        </For>
      </VStack>
    </VStack>
  );
};
