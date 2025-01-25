import { type Component, type ComponentProps, createSignal } from "solid-js";
import { HStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import type { ConfigFormData } from "~/modules/configs/components/cookie-form";
import { AlertDialog } from "~/ui/alert-dialog";
import { PencilIcon } from "~/ui/icons/pencil-icon";
import { SlidersHorizontalIcon } from "~/ui/icons/sliders-horizontal-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { Menu } from "~/ui/menu";
import type { SavedCookie } from "../services/storage";
import { useCookiesContext } from "./cookies-context";
import { UpdateCookieDialog } from "./update-cookie-dialog";

const DELETE_VALUE = "delete";
const UPDATE_VALUE = "update";
const ADVANCED_VALUE = "advanced";

type CookieCardMenuProps = {
  cookie: SavedCookie;
  showAdvanced: boolean;
  onShowAdvancedClick: () => void;
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
      case ADVANCED_VALUE: {
        props.onShowAdvancedClick();
        return;
      }
      default:
    }
  };

  const onUpdateSubmit = (cookie: ConfigFormData) => {
    cookiesContext().updateCookie(props.cookie.id, cookie);
    setIsUpdateOpen(false);
  };

  const onDeleteConfirm = () => {
    cookiesContext().removeCookie(props.cookie.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Menu.Root onSelect={onSelect} lazyMount unmountOnExit>
        <Menu.IconTrigger />
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item value={ADVANCED_VALUE}>
              <HStack gap="2">
                <SlidersHorizontalIcon />
                {t(
                  props.showAdvanced
                    ? "cookies.list.hideAdvanced"
                    : "cookies.list.showAdvanced",
                )}
              </HStack>
            </Menu.Item>
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
