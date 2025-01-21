import { type Component, type ParentProps, createSignal } from "solid-js";
import { css } from "styled-system/css";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Drawer } from "~/ui/drawer";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { CookieForm, type CookieFormData } from "./cookie-form";
import { useCookiesContext } from "./cookies-context";

export const IconButtonAddCookieDialog: Component = () => {
  const { t } = useI18n();

  const formId = "icon-add-cookie-form";

  return (
    <CookieDialogNoTrigger formId={formId}>
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
    </CookieDialogNoTrigger>
  );
};

export const CardButtonAddCookieDialog: Component = () => {
  const { t } = useI18n();

  const formId = "card-add-cookie-form";

  return (
    <CookieDialogNoTrigger formId={formId}>
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
    </CookieDialogNoTrigger>
  );
};

type CookieDialogNoTriggerProps = ParentProps<{
  formId: string;
}>;

const CookieDialogNoTrigger: Component<CookieDialogNoTriggerProps> = (
  props,
) => {
  const { t } = useI18n();

  const cookiesContext = useCookiesContext();

  const [isOpen, setIsOpen] = createSignal(false);

  const onOpenChange = (details: OpenChangeDetails) => {
    setIsOpen(details.open);
  };

  const onSubmit = (data: CookieFormData) => {
    cookiesContext().addCookie(data);
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
            <CookieForm onSubmit={onSubmit} id={props.formId} />
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
