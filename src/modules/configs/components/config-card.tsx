import type { Component, ComponentProps, ParentProps } from "solid-js";
import { Flex } from "styled-system/jsx";
import { flex } from "styled-system/patterns";
import { useI18n } from "~/modules/common/contexts/i18n";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";

export const ConfigCardForm: Component<ComponentProps<"form">> = (props) => {
  return (
    <Card.Body px={3} pb={2}>
      <form class={flex({ flexDirection: "column", gap: 4 })} {...props} />
    </Card.Body>
  );
};

export const ConfigCardHeader: Component<ParentProps> = (props) => {
  return (
    <Card.Header p={3} display="grid" gridTemplateColumns="1fr auto">
      {props.children}
    </Card.Header>
  );
};

type ConfigCardFooterProps = {
  formId: string;
  isDirty: boolean;
};

export const ConfigCardFooter: Component<ConfigCardFooterProps> = (props) => {
  const { t } = useI18n();

  return (
    <Card.Footer px={3} pt={1} pb={3} gap="3">
      <Button size="xs" disabled={!props.isDirty} form={props.formId}>
        {t("common.save")}
      </Button>
    </Card.Footer>
  );
};

type ConfigCardHeadingProps = {
  name: string;
};

export const ConfigCardHeading: Component<ConfigCardHeadingProps> = (props) => {
  const { t } = useI18n();

  return (
    <Flex flexDirection="column" gap="2">
      <Card.Title>{props.name}</Card.Title>
      <Card.Description>
        {t("cookies.list.cardDescription", { name: props.name })}
      </Card.Description>
    </Flex>
  );
};
