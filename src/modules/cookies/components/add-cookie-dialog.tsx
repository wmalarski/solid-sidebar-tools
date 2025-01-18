import { type ComponentProps, createSignal } from "solid-js";
import { Stack } from "styled-system/jsx";
import { stack } from "styled-system/patterns";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Dialog } from "~/ui/dialog";
import { IconButton } from "~/ui/icon-button";
import { PlusIcon } from "~/ui/icons/plus-icon";
import { XIcon } from "~/ui/icons/x-icon";
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
    <Dialog.Root open={isOpen()} onOpenChange={onOpenChange}>
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
            <Stack gap="3" direction="row" width="full">
              <Dialog.CloseTrigger
                asChild={(closeTriggerProps) => (
                  <Button
                    {...closeTriggerProps()}
                    variant="outline"
                    width="full"
                  >
                    {t("common.cancel")}
                  </Button>
                )}
              />
              <Button width="full" type="submit">
                {t("common.confirm")}
              </Button>
            </Stack>
          </form>
          <Dialog.CloseTrigger
            asChild={(closeTriggerProps) => (
              <IconButton
                {...closeTriggerProps()}
                aria-label={t("common.closeDialog")}
                variant="ghost"
                size="sm"
                position="absolute"
                top="2"
                right="2"
              >
                <XIcon />
              </IconButton>
            )}
          />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
