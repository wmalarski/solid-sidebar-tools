import { createSignal, type Component, type ComponentProps } from "solid-js";
import { css } from "styled-system/css";
import { HStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { IconButton } from "~/ui/icon-button";
import { EllipsisVertical } from "~/ui/icons/ellipsis-vertical-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { Menu } from "~/ui/menu";
import type { CookieFormData } from "./cookie-form";
import { useCookiesContext, type CookieValue } from "./cookies-context";
import { UpdateCookieDialog } from "./update-cookie-dialog";

const DELETE_VALUE = "delete";
const UPDATE_VALUE = "update";

type CookieCardMenuProps = {
  cookie: CookieValue;
};

export const CookieCardMenu: Component<CookieCardMenuProps> = (props) => {
  const { t } = useI18n();

  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);
  const [isUpdateOpen, setIsUpdateOpen] = createSignal(false);

  const cookiesContext = useCookiesContext();

  const onSelect: ComponentProps<typeof Menu.Root>["onSelect"] = (details) => {
    switch (details.value) {
      case DELETE_VALUE: {
        setIsDeleteOpen(true);
        return;
      }
      case UPDATE_VALUE: {
        setIsUpdateOpen(true);
        return;
      }
      default:
    }
  };

  const onUpdateSubmit = (cookie: CookieFormData) => {
    cookiesContext().updateCookie(props.cookie.id, cookie);
    setIsUpdateOpen(false);
  };

  return (
    <>
      <Menu.Root onSelect={onSelect} lazyMount unmountOnExit>
        <Menu.Trigger
          asChild={(triggerProps) => (
            <IconButton
              {...triggerProps({
                class: css({
                  "& svg": {
                    transitionDuration: "100ms",
                    transitionProperty: "rotate",
                  },
                  _open: {
                    "& svg": {
                      rotate: "90deg",
                    },
                  },
                }),
              })}
              variant="ghost"
              aria-label={t("cookies.list.options")}
            >
              <EllipsisVertical />
            </IconButton>
          )}
        />
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value={UPDATE_VALUE}>
              <HStack gap="2">
                <TrashIcon />
                {t("cookies.list.update")}
              </HStack>
            </Menu.Item>
            <Menu.Item value={DELETE_VALUE}>
              <HStack gap="2">
                <TrashIcon />
                {t("cookies.list.delete")}
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      <UpdateCookieDialog
        initialData={props.cookie}
        isOpen={isUpdateOpen()}
        onIsOpenChange={setIsUpdateOpen}
        onSubmit={onUpdateSubmit}
      />
    </>
  );
};
