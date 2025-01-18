import { createSignal, type Component, type ComponentProps } from "solid-js";
import { HStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { IconButton } from "~/ui/icon-button";
import { EllipsisVertical } from "~/ui/icons/ellipsis-vertical-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { Menu } from "~/ui/menu";

const DELETE_VALUE = "delete";

export const CookieCardMenu: Component = () => {
  const { t } = useI18n();

  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);

  const onSelect: ComponentProps<typeof Menu.Root>["onSelect"] = (details) => {
    switch (details.value) {
      case DELETE_VALUE: {
        setIsDeleteOpen(true);
        return;
      }
      default:
    }
  };

  return (
    <>
      <Menu.Root onSelect={onSelect}>
        <Menu.Trigger
          asChild={(triggerProps) => (
            <IconButton
              {...triggerProps()}
              variant="ghost"
              aria-label={t("cookies.list.options")}
            >
              <EllipsisVertical />
            </IconButton>
          )}
        />
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value={DELETE_VALUE}>
              <HStack gap="2">
                <TrashIcon />
                {t("cookies.list.delete")}
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
    </>
  );
};
