import {
  type Component,
  type ComponentProps,
  Show,
  createSignal,
} from "solid-js";
import { HStack } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { useSavedConfigsContext } from "~/modules/configs/contexts/saved-configs";
import type { ConfigFormData } from "~/modules/configs/dialogs/config-form";
import { AlertDialog } from "~/ui/alert-dialog";
import { PencilIcon } from "~/ui/icons/pencil-icon";
import { SlidersHorizontalIcon } from "~/ui/icons/sliders-horizontal-icon";
import { TrashIcon } from "~/ui/icons/trash-icon";
import { Menu } from "~/ui/menu";
import { UpdateConfigDialog } from "../dialogs/update-config-dialog";
import type { SavedConfig } from "../services/storage";

const DELETE_VALUE = "delete";
const UPDATE_VALUE = "update";
const ADVANCED_VALUE = "advanced";

export const ConfigCardMenu: Component<{
  config: SavedConfig;
  showAdvanced: boolean;
  onShowAdvancedClick: () => void;
}> = (props) => {
  const { t } = useI18n();

  const [isDeleteOpen, setIsDeleteOpen] = createSignal(false);
  const [isUpdateOpen, setIsUpdateOpen] = createSignal(false);

  const savedConfigs = useSavedConfigsContext();

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

  const onUpdateSubmit = (data: ConfigFormData) => {
    savedConfigs().update({ ...props.config, ...data });
    setIsUpdateOpen(false);
  };

  const onDeleteConfirm = () => {
    savedConfigs().remove(props.config.id);
    setIsDeleteOpen(false);
  };

  return (
    <>
      <Menu.Root onSelect={onSelect} lazyMount unmountOnExit>
        <Menu.IconTrigger />
        <Menu.Positioner>
          <Menu.Content>
            <Show when={props.config.kind === "cookie"}>
              <Menu.Item value={ADVANCED_VALUE}>
                <HStack gap="2">
                  <SlidersHorizontalIcon />
                  {t(
                    props.showAdvanced
                      ? "configs.card.hideAdvanced"
                      : "configs.card.showAdvanced",
                  )}
                </HStack>
              </Menu.Item>
            </Show>
            <Menu.Item value={UPDATE_VALUE}>
              <HStack gap="2">
                <PencilIcon />
                {t("common.update")}
              </HStack>
            </Menu.Item>
            <Menu.Item value={DELETE_VALUE}>
              <HStack gap="2">
                <TrashIcon />
                {t("common.delete")}
              </HStack>
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Menu.Root>
      <UpdateConfigDialog
        initialData={props.config}
        isOpen={isUpdateOpen()}
        onIsOpenChange={setIsUpdateOpen}
        onSubmit={onUpdateSubmit}
      />
      <AlertDialog
        description={t("configs.card.deleteDescription")}
        isOpen={isDeleteOpen()}
        onConfirm={onDeleteConfirm}
        onIsOpenChange={setIsDeleteOpen}
        colorPalette="red"
        title={t("common.delete")}
      />
    </>
  );
};
