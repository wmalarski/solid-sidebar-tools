import { type Component, createMemo } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import {
  ConfigForm,
  type ConfigFormData,
} from "~/modules/configs/dialogs/config-form";
import type { SavedConfig } from "~/modules/configs/services/storage";
import { useCookiesContext } from "~/modules/cookies/contexts/cookies-context";
import { Button } from "~/ui/button";
import { Drawer } from "~/ui/drawer";
import type { OpenChangeDetails } from "~/ui/styled/combobox";

export const UpdateConfigDialog: Component<{
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
  initialData: SavedConfig;
  onSubmit: (data: ConfigFormData) => void;
}> = (props) => {
  const { t } = useI18n();

  const cookiesContext = useCookiesContext();

  const formId = createMemo(
    () => `update-config-form-${props.initialData.name}`,
  );

  const onOpenChange = (details: OpenChangeDetails) => {
    props.onIsOpenChange(details.open);
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
            <Drawer.Title>{t("configs.dialogs.updateConfig")}</Drawer.Title>
            <Drawer.XClose />
          </Drawer.Header>
          <Drawer.Body>
            <ConfigForm
              configValues={
                props.initialData.kind === "cookie"
                  ? cookiesContext().get()
                  : []
              }
              id={formId()}
              initialData={props.initialData}
              onSubmit={props.onSubmit}
            />
          </Drawer.Body>
          <Drawer.Footer gap="3">
            <Drawer.Cancel />
            <Button form={formId()} size="xs" type="submit">
              {t("common.confirm")}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
