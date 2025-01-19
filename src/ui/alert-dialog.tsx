import type { Component } from "solid-js";
import {} from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button, type ButtonProps } from "./button";
import { Drawer } from "./drawer";
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
    <Drawer.Root
      open={props.isOpen}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      unmountOnExit
      lazyMount
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{props.title}</Drawer.Title>
            <Drawer.Description>{props.description}</Drawer.Description>
            <Drawer.XClose />
          </Drawer.Header>
          <Drawer.Footer gap="3">
            <Drawer.Cancel />
            <Button
              size="xs"
              type="button"
              onClick={onConfirm}
              colorPalette={props.colorPalette}
            >
              {t("common.confirm")}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
