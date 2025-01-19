import { type Assign, Menu } from "@ark-ui/solid";
import type { Component, ComponentProps } from "solid-js";
import { css } from "styled-system/css";
import { type MenuVariantProps, menu } from "styled-system/recipes";
import type { HTMLStyledProps } from "styled-system/types";
import { useI18n } from "~/modules/common/contexts/i18n";
import { EllipsisVertical } from "../icons/ellipsis-vertical-icon";
import { IconButton } from "./icon-button";
import { createStyleContext } from "./utils/create-style-context";

const { withRootProvider, withContext } = createStyleContext(menu);

export type RootProviderProps = ComponentProps<typeof RootProvider>;
export const RootProvider = withRootProvider<
  Assign<Menu.RootProviderProps, MenuVariantProps>
>(Menu.RootProvider);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withRootProvider<Assign<Menu.RootProps, MenuVariantProps>>(
  Menu.Root,
);

export const Arrow = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ArrowBaseProps>
>(Menu.Arrow, "arrow");

export const ArrowTip = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ArrowTipBaseProps>
>(Menu.ArrowTip, "arrowTip");

export const CheckboxItem = withContext<
  Assign<HTMLStyledProps<"div">, Menu.CheckboxItemBaseProps>
>(Menu.CheckboxItem, "item");

export const Content = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ContentBaseProps>
>(Menu.Content, "content");

export const ContextTrigger = withContext<
  Assign<HTMLStyledProps<"button">, Menu.ContextTriggerBaseProps>
>(Menu.ContextTrigger, "contextTrigger");

export const Indicator = withContext<
  Assign<HTMLStyledProps<"div">, Menu.IndicatorBaseProps>
>(Menu.Indicator, "indicator");

export const ItemGroupLabel = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ItemGroupLabelBaseProps>
>(Menu.ItemGroupLabel, "itemGroupLabel");

export const ItemGroup = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ItemGroupBaseProps>
>(Menu.ItemGroup, "itemGroup");

export const ItemIndicator = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ItemIndicatorBaseProps>
>(Menu.ItemIndicator, "itemIndicator");

export const Item = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ItemBaseProps>
>(Menu.Item, "item");

export const ItemText = withContext<
  Assign<HTMLStyledProps<"div">, Menu.ItemTextBaseProps>
>(Menu.ItemText, "itemText");

export const Positioner = withContext<
  Assign<HTMLStyledProps<"div">, Menu.PositionerBaseProps>
>(Menu.Positioner, "positioner");

export const RadioItemGroup = withContext<
  Assign<HTMLStyledProps<"div">, Menu.RadioItemGroupBaseProps>
>(Menu.RadioItemGroup, "itemGroup");

export const RadioItem = withContext<
  Assign<HTMLStyledProps<"div">, Menu.RadioItemBaseProps>
>(Menu.RadioItem, "item");

export const Separator = withContext<
  Assign<HTMLStyledProps<"hr">, Menu.SeparatorBaseProps>
>(Menu.Separator, "separator");

export const TriggerItem = withContext<
  Assign<HTMLStyledProps<"div">, Menu.TriggerItemBaseProps>
>(Menu.TriggerItem, "triggerItem");

export const Trigger = withContext<
  Assign<HTMLStyledProps<"button">, Menu.TriggerBaseProps>
>(Menu.Trigger, "trigger");

export const IconTrigger: Component = () => {
  const { t } = useI18n();

  return (
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
          size="xs"
          aria-label={t("cookies.list.options")}
        >
          <EllipsisVertical />
        </IconButton>
      )}
    />
  );
};

export { MenuContext as Context } from "@ark-ui/solid";
