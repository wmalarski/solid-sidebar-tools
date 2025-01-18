import { createMemo, type Component } from "solid-js";
import { Grid, Stack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Dialog } from "~/ui/dialog";
import type { OpenChangeDetails } from "~/ui/styled/combobox";
import { CookieForm, type CookieFormData } from "./cookie-form";

type UpdateCookieDialogProps = {
  isOpen: boolean;
  onIsOpenChange: (isOpen: boolean) => void;
  initialData: CookieFormData;
  onSubmit: (data: CookieFormData) => void;
};

export const UpdateCookieDialog: Component<UpdateCookieDialogProps> = (
  props,
) => {
  const { t } = useI18n();

  const formId = createMemo(
    () => `update-cookie-form-${props.initialData.name}`,
  );

  const onOpenChange = (details: OpenChangeDetails) => {
    props.onIsOpenChange(details.open);
  };

  return (
    <Dialog.Root
      open={props.isOpen}
      onOpenChange={onOpenChange}
      closeOnInteractOutside={false}
      unmountOnExit
      lazyMount
    >
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content>
          <Stack gap="8" p="6">
            <Dialog.Title>{t("cookies.form.updateCookie")}</Dialog.Title>
            <CookieForm
              initialData={props.initialData}
              onSubmit={props.onSubmit}
              id={formId()}
            />
            <Grid gap="3" gridTemplateColumns="1fr 1fr" width="full">
              <Dialog.Cancel />
              <Button form={formId()} type="submit">
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
