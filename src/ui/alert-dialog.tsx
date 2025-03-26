import type { Component } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button, type ButtonProps } from "./button";
import { Drawer } from "./drawer";
import type { OpenChangeDetails } from "./styled/combobox";

export const AlertDialog: Component<{
  isOpen: boolean;
  title: string;
  colorPalette?: ButtonProps["colorPalette"];
  description: string;
  onConfirm: () => void;
  onIsOpenChange: (isOpen: boolean) => void;
}> = (props) => {
  const { t } = useI18n();

  const onOpenChange = (details: OpenChangeDetails) => {
    props.onIsOpenChange(details.open);
  };

  const onConfirm = () => {
    props.onConfirm();
  };

  return (
    <Drawer.Root
      closeOnInteractOutside={false}
      lazyMount
      onOpenChange={onOpenChange}
      open={props.isOpen}
      unmountOnExit
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
              colorPalette={props.colorPalette}
              onClick={onConfirm}
              size="xs"
              type="button"
            >
              {t("common.confirm")}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
