import type { Component, ComponentProps } from "solid-js";
import { Box } from "styled-system/jsx";
import { Collapsible } from "~/ui/collapsible";

type CookieAdvancedFieldsProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export const CookieAdvancedFields: Component<CookieAdvancedFieldsProps> = (
  props,
) => {
  const onOpenChange: ComponentProps<typeof Collapsible.Root>["onOpenChange"] =
    (details) => {
      props.onOpenChange(details.open);
    };

  return (
    <Collapsible.Root open={props.isOpen} onOpenChange={onOpenChange}>
      <Collapsible.Content>
        <Box
          bg="colorPalette.default"
          color="colorPalette.fg"
          p="4"
          borderRadius="l3"
          mt="3"
        >
          Content
        </Box>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};
