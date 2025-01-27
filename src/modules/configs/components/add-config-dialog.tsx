import { type Component, type ParentProps, createSignal } from "solid-js";
import { css } from "styled-system/css";
import { useI18n } from "~/modules/common/contexts/i18n";
import {
  ConfigForm,
  type ConfigFormData,
} from "~/modules/configs/components/config-form";
import { useSavedConfigsContext } from "~/modules/configs/contexts/saved-configs";
import type { SavedConfig } from "~/modules/configs/services/storage";
import { Button } from "~/ui/button";
import { Drawer } from "~/ui/drawer";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { useCookiesContext } from "../../cookies/contexts/cookies-context";

export const IconButtonAddConfigDialog: Component<{
  kind: SavedConfig["kind"];
}> = (props) => {
  const { t } = useI18n();

  const formId = "icon-add-config-form";

  return (
    <ConfigDialogNoTrigger formId={formId} kind={props.kind}>
      <Drawer.Trigger
        asChild={(triggerProps) => (
          <IconButton size="xs" {...triggerProps()}>
            <span class={css({ srOnly: true })}>
              {t("cookies.form.addNewCookie")}
            </span>
            <PlusIcon />
          </IconButton>
        )}
      />
    </ConfigDialogNoTrigger>
  );
};

export const CardButtonAddConfigDialog: Component<{
  kind: SavedConfig["kind"];
}> = (props) => {
  const { t } = useI18n();

  const formId = "card-add-config-form";

  return (
    <ConfigDialogNoTrigger formId={formId} kind={props.kind}>
      <Drawer.Trigger
        asChild={(triggerProps) => (
          <Button
            variant="subtle"
            size="xs"
            {...triggerProps({ class: css({ h: "32" }) })}
          >
            <PlusIcon />
            {t("cookies.form.addNewCookie")}
          </Button>
        )}
      />
    </ConfigDialogNoTrigger>
  );
};

const ConfigDialogNoTrigger: Component<
  ParentProps<{
    formId: string;
    kind: SavedConfig["kind"];
  }>
> = (props) => {
  const { t } = useI18n();

  const savedConfigs = useSavedConfigsContext();
  const cookiesContext = useCookiesContext();

  const [isOpen, setIsOpen] = createSignal(false);

  const onOpenChange = (details: OpenChangeDetails) => {
    setIsOpen(details.open);
  };

  const onSubmit = (data: ConfigFormData) => {
    savedConfigs().add({ ...data, kind: props.kind });
    setIsOpen(false);
  };

  return (
    <Drawer.Root
      open={isOpen()}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      unmountOnExit
      lazyMount
    >
      {props.children}
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{t("cookies.form.addNewCookie")}</Drawer.Title>
            <Drawer.XClose />
          </Drawer.Header>
          <Drawer.Body>
            <ConfigForm
              configValues={
                props.kind === "cookie" ? cookiesContext().tabCookies : []
              }
              onSubmit={onSubmit}
              id={props.formId}
            />
          </Drawer.Body>
          <Drawer.Footer gap="3">
            <Drawer.Cancel />
            <Button form={props.formId} size="xs" type="submit">
              {t("common.confirm")}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};
