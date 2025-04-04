import { type Component, createMemo, createSignal, For } from "solid-js";
import { css } from "styled-system/css";
import { Grid, HStack, VStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Field } from "~/ui/field";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { Tooltip } from "~/ui/tooltip";

const createConfigValuesState = (initialValues: string[] = []) => {
  const nonEmptyInitialValues =
    initialValues.length === 0 ? [""] : initialValues;

  const [inputId, setInputId] = createSignal(nonEmptyInitialValues.length);

  const [entries, setEntries] = createSignal(
    nonEmptyInitialValues.map((value, index) => ({ id: index, value })),
  );

  const addInput = () => {
    const nextId = inputId();
    setEntries((current) => [...current, { id: nextId, value: "" }]);
    setInputId((current) => current + 1);
  };

  const removeInput = (id: number) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return { addInput, entries, removeInput };
};

export const ConfigValuesFields: Component<{
  initialValues?: string[];
}> = (props) => {
  const { t } = useI18n();

  const [listRef, setListRef] = createSignal<HTMLElement>();

  const inputsState = createMemo(() =>
    createConfigValuesState(props?.initialValues),
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
        alignItems="center"
        fontWeight="semibold"
        gap="4"
        gridTemplateColumns="1fr auto"
        w="full"
      >
        {t("configs.form.values")}
        <Tooltip.SimpleTooltip
          asChild={(tooltipProps) => (
            <IconButton
              disabled={shouldDisableAdd()}
              size="xs"
              type="button"
              {...tooltipProps({ onClick: onAddValueClick })}
            >
              <span class={css({ srOnly: true })}>
                {t("configs.form.addValue")}
              </span>
              <PlusIcon />
            </IconButton>
          )}
        >
          {t("configs.form.addValue")}
        </Tooltip.SimpleTooltip>
      </Grid>
      <VStack gap="4" w="full">
        <For each={inputsState().entries()}>
          {(entry, index) => (
            <Field.Root required w="full">
              <Field.Label>
                {t("configs.form.value", { index: index() + 1 })}
              </Field.Label>
              <HStack alignItems="center" justifyContent="center">
                <Field.Input
                  autocomplete="off"
                  name={`values[${index()}]`}
                  placeholder={t("configs.form.value")}
                  size="xs"
                  value={entry.value}
                />
                <Tooltip.SimpleTooltip
                  asChild={(tooltipProps) => (
                    <IconButton
                      colorPalette="red"
                      disabled={shouldDisableDelete()}
                      size="xs"
                      type="button"
                      {...tooltipProps({
                        onClick: onDeleteClickFactory(entry.id),
                      })}
                    >
                      <span class={css({ srOnly: true })}>
                        {t("common.delete")}
                      </span>
                      <TrashIcon />
                    </IconButton>
                  )}
                >
                  {t("common.delete")}
                </Tooltip.SimpleTooltip>
              </HStack>
            </Field.Root>
          )}
        </For>
      </VStack>
    </VStack>
  );
};
