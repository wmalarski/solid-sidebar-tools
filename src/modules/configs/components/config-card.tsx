import { decode } from "decode-formdata";
import type { Component, ComponentProps, ParentProps } from "solid-js";
import { createMemo, createSignal, Show } from "solid-js";
import { Flex } from "styled-system/jsx";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { useCurrentUrlContext } from "~/modules/common/contexts/current-url";
import { useI18n } from "~/modules/common/contexts/i18n";
import { ConfigFields } from "~/modules/configs/components/config-fields";
import { CookieAdvancedFields } from "~/modules/cookies/components/cookie-advanced-fields";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import { reloadChromeTab } from "../../common/services/tabs";
import { saveCookie } from "../../cookies/services/cookies";
import type { SavedConfig } from "../services/storage";
import { ConfigCardMenu } from "./config-card-menu";

type ConfigCardProps = {
  config: SavedConfig;
  value?: string;
};

export const ConfigCard: Component<ConfigCardProps> = (props) => {
  const currentUrlContext = useCurrentUrlContext();
  const formId = createMemo(() => `config-form-${props.config.name}`);

  const [isDirty, setIsDirty] = createSignal(false);
  const [showAdvanced, setShowAdvanced] = createSignal(false);

  const onFormChange = () => {
    setIsDirty(true);
  };

  const onFormSubmit: ComponentProps<"form">["onChange"] = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const parsed = v.safeParse(
      v.object({ value: v.string(), custom: v.optional(v.string()) }),
      decode(formData),
    );

    setIsDirty(false);

    if (!parsed.success) {
      return;
    }

    if (props.config.kind === "cookie") {
      await saveCookie({
        url: currentUrlContext().url(),
        name: props.config.name,
        value: parsed.output.value,
      });
    }

    await reloadChromeTab();
  };

  const onShowAdvancedClick = () => {
    setShowAdvanced((current) => !current);
  };

  return (
    <Card.Root>
      <ConfigCardHeader>
        <ConfigCardHeading name={props.config.name} />
        <ConfigCardMenu
          config={props.config}
          onShowAdvancedClick={onShowAdvancedClick}
          showAdvanced={showAdvanced()}
        />
      </ConfigCardHeader>
      <ConfigCardForm
        id={formId()}
        onChange={onFormChange}
        onSubmit={onFormSubmit}
      >
        <ConfigFields config={props.config} value={props.value} />
        <Show when={props.config.kind === "cookie"}>
          <CookieAdvancedFields
            isOpen={showAdvanced()}
            onOpenChange={setShowAdvanced}
          />
        </Show>
      </ConfigCardForm>
      <ConfigCardFooter formId={formId()} isDirty={isDirty()} />
    </Card.Root>
  );
};

const ConfigCardForm: Component<ComponentProps<"form">> = (props) => {
  return (
    <Card.Body px={3} pb={2}>
      <form class={flex({ flexDirection: "column", gap: 4 })} {...props} />
    </Card.Body>
  );
};

const ConfigCardHeader: Component<ParentProps> = (props) => {
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

const ConfigCardFooter: Component<ConfigCardFooterProps> = (props) => {
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

const ConfigCardHeading: Component<ConfigCardHeadingProps> = (props) => {
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
