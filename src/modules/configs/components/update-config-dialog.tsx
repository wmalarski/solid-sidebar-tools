import { type Component, createMemo } from "solid-js";
import { useI18n } from "~/modules/common/contexts/i18n";
import {
  ConfigForm,
  type ConfigFormData,
} from "~/modules/configs/components/config-form";
import type { SavedConfig } from "~/modules/configs/services/storage";
import { Button } from "~/ui/button";
import { Drawer } from "~/ui/drawer";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { useCookiesContext } from "../../cookies/contexts/cookies-context";

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
            <Drawer.Title>{t("configs.dialogs.updateConfig")}</Drawer.Title>
            <Drawer.XClose />
          </Drawer.Header>
          <Drawer.Body>
            <ConfigForm
              initialData={props.initialData}
              onSubmit={props.onSubmit}
              configValues={
                props.initialData.kind === "cookie"
                  ? cookiesContext().tabCookies
                  : []
              }
              id={formId()}
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
