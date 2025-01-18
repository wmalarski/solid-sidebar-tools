import { createSignal, type Component } from "solid-js";
import { Grid, Stack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Dialog } from "~/ui/dialog";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { CookieForm, type CookieFormData } from "./cookie-form";
import { useCookiesContext } from "./cookies-context";

export const AddCookieDialog: Component = () => {
  const { t } = useI18n();

  const formId = "add-cookie-form";

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
      <Dialog.Trigger
        asChild={(triggerProps) => (
          <IconButton
            aria-label={t("cookies.form.addNewCookie")}
            {...triggerProps()}
          >
            <PlusIcon />
          </IconButton>
        )}
      />
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="8" p="6">
            <Dialog.Title>{t("cookies.form.addNewCookie")}</Dialog.Title>
            <CookieForm onSubmit={onSubmit} id={formId} />
            <Grid gap="3" gridTemplateColumns="1fr 1fr" width="full">
              <Dialog.Cancel />
              <Button form={formId} type="submit">
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
