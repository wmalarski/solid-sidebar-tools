import { type ComponentProps, createSignal } from "solid-js";
import { Grid, Stack } from "styled-system/jsx";
import { stack } from "styled-system/patterns";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Dialog } from "~/ui/dialog";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { CookieFields } from "./cookie-fields";

export const AddCookieDialog = () => {
  const { t } = useI18n();

  const [isOpen, setIsOpen] = createSignal(false);

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    console.log(Object.fromEntries(formData.entries()));
  };

  const onOpenChange = (details: OpenChangeDetails) => {
    setIsOpen(details.open);
  };

  return (
    <Dialog.Root
      open={isOpen()}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
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
          <form class={stack({ gap: 8, p: 6 })} onSubmit={onSubmit}>
            <Stack gap="1">
              <Dialog.Title>{t("cookies.form.addNewCookie")}</Dialog.Title>
            </Stack>
            <CookieFields />
            <Grid gap="3" gridTemplateColumns="1fr 1fr" width="full">
              <Dialog.Cancel />
              <Button type="submit">{t("common.confirm")}</Button>
            </Grid>
          </form>
          <Dialog.XClose />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
