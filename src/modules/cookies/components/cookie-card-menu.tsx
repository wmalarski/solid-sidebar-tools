import { type Component, type ComponentProps, createSignal } from "solid-js";
import { HStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { AlertDialog } from "~/ui/alert-dialog";
import { PencilIcon } from "~/ui/icons/pencil-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { Menu } from "~/ui/menu";
import type { CookieFormData } from "./cookie-form";
import { type CookieValue, useCookiesContext } from "./cookies-context";
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

  const onDeleteConfirm = () => {
    cookiesContext().removeCookie(props.cookie.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Menu.Root size="xs" onSelect={onSelect} lazyMount unmountOnExit>
        <Menu.IconTrigger />
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value={UPDATE_VALUE}>
              <HStack gap="2">
                <PencilIcon />
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
      <AlertDialog
        description={t("cookies.list.deleteDescription")}
        isOpen={isDeleteOpen()}
        onConfirm={onDeleteConfirm}
        onIsOpenChange={setIsDeleteOpen}
        colorPalette="red"
        title={t("cookies.list.delete")}
      />
    </>
  );
};
