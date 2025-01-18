import type { Component } from "solid-js";
import { Grid, Stack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button, type ButtonProps } from "./button";
import { Dialog } from "./dialog";
import type { OpenChangeDetails } from "./styled/combobox";

type AlertDialogProps = {
  isOpen: boolean;
  title: string;
  colorPalette?: ButtonProps["colorPalette"];
  description: string;
  onConfirm: () => void;
  onIsOpenChange: (isOpen: boolean) => void;
};

export const AlertDialog: Component<AlertDialogProps> = (props) => {
  const { t } = useI18n();

  const onOpenChange = (details: OpenChangeDetails) => {
    props.onIsOpenChange(details.open);
  };

  const onConfirm = () => {
    props.onConfirm();
  };

  return (
    <Dialog.Root
      open={props.isOpen}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      unmountOnExit
      lazyMount
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="2" p="6">
            <Dialog.Title>{props.title}</Dialog.Title>
            <Dialog.Description>{props.description}</Dialog.Description>
            <Grid gap="3" pt="4" gridTemplateColumns="1fr 1fr" width="full">
              <Dialog.Cancel />
              <Button
                type="button"
                onClick={onConfirm}
                colorPalette={props.colorPalette}
              >
                {t("common.confirm")}
              </Button>
            </Grid>
          </Stack>
          <Dialog.XClose />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
