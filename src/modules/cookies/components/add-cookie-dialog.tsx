import { type Component, type ParentProps, createSignal } from "solid-js";
import { css } from "styled-system/css";
import { Grid, Stack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Dialog } from "~/ui/dialog";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { Tooltip } from "~/ui/tooltip";
import { CookieForm, type CookieFormData } from "./cookie-form";
import { useCookiesContext } from "./cookies-context";

export const IconButtonAddCookieDialog: Component = () => {
  const { t } = useI18n();

  const formId = "icon-add-cookie-form";

  return (
    <CookieDialogNoTrigger formId={formId}>
      <Tooltip.SimpleTooltip
        asChild={(tooltipProps) => (
          <Dialog.Trigger
            asChild={(triggerProps) => (
              <IconButton
                size="xs"
                aria-label={t("cookies.form.addNewCookie")}
                {...triggerProps(tooltipProps())}
              >
                <PlusIcon />
              </IconButton>
            )}
          />
        )}
      >
        {t("cookies.form.addNewCookie")}
      </Tooltip.SimpleTooltip>
    </CookieDialogNoTrigger>
  );
};

export const CardButtonAddCookieDialog: Component = () => {
  const { t } = useI18n();

  const formId = "card-add-cookie-form";

  return (
    <CookieDialogNoTrigger formId={formId}>
      <Dialog.Trigger
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
    <Dialog.Root
      open={isOpen()}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      unmountOnExit
      lazyMount
    >
      {props.children}
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="6" p="4">
            <Dialog.Title>{t("cookies.form.addNewCookie")}</Dialog.Title>
            <CookieForm onSubmit={onSubmit} id={props.formId} />
            <Grid gap="3" gridTemplateColumns="1fr 1fr" width="full">
              <Dialog.Cancel />
              <Button form={props.formId} size="xs" type="submit">
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
