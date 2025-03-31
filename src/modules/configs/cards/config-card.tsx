import { decode } from "decode-formdata";
import type { Component, ComponentProps, ParentProps } from "solid-js";
import { createMemo, createSignal, Show } from "solid-js";
import { Flex } from "styled-system/jsx";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { useI18n } from "~/modules/common/contexts/i18n";
import { getCurrentUrl, reloadChromeTab } from "~/modules/common/services/tabs";
import {
  ConfigFields,
  EMPTY_VALUE,
} from "~/modules/configs/cards/config-fields";
import {
  CookieAdvancedFields,
  createCookieAdvancedFieldsParseInfo,
  createCookieAdvancedFieldsSchema,
} from "~/modules/cookies/components/cookie-advanced-fields";
import { removeCookie, saveCookie } from "~/modules/cookies/services/cookies";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import type { SavedConfig } from "../services/storage";
import { ConfigCardMenu } from "./config-card-menu";

export const ConfigCard: Component<{
  config: SavedConfig;
  value?: string;
}> = (props) => {
  const formId = createMemo(() => `config-form-${props.config.name}`);

  const [isDirty, setIsDirty] = createSignal(false);
  const [showAdvanced, setShowAdvanced] = createSignal(false);

  const onFormChange = () => {
    setIsDirty(true);
  };

  const onFormSubmit: ComponentProps<"form">["onChange"] = async (event) => {
    event.preventDefault();

    const url = await getCurrentUrl();

    if (!url) {
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);

    const decoded = decode(
      formData,
      showAdvanced() ? createCookieAdvancedFieldsParseInfo() : {},
    );

    const parsed = v.safeParse(
      v.intersect([
        v.object({ custom: v.optional(v.string()), value: v.string() }),
        v.variant("kind", [createCookieAdvancedFieldsSchema()]),
      ]),
      decoded,
    );

    setIsDirty(false);

    if (!parsed.success || props.config.kind !== "cookie") {
      return;
    }

    if (parsed.output.value === EMPTY_VALUE) {
      await removeCookie({ name: props.config.name, url });
    } else {
      await saveCookie({
        domain: parsed.output.domain,
        expirationDate: parsed.output.expirationDate ?? undefined,
        httpOnly: parsed.output.httpOnly,
        name: props.config.name,
        path: parsed.output.path,
        sameSite: parsed.output.sameSite,
        secure: parsed.output.secure,
        url,
        value: parsed.output.custom ?? parsed.output.value,
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
        <input name="kind" type="hidden" value={props.config.kind} />
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
    <Card.Body pb={2} px={3}>
      <form class={flex({ flexDirection: "column", gap: 4 })} {...props} />
    </Card.Body>
  );
};

const ConfigCardHeader: Component<ParentProps> = (props) => {
  return (
    <Card.Header display="grid" gridTemplateColumns="1fr auto" p={3}>
      {props.children}
    </Card.Header>
  );
};

const ConfigCardFooter: Component<{
  formId: string;
  isDirty: boolean;
}> = (props) => {
  const { t } = useI18n();

  return (
    <Card.Footer gap="3" pb={3} pt={1} px={3}>
      <Button disabled={!props.isDirty} form={props.formId} size="xs">
        {t("common.save")}
      </Button>
    </Card.Footer>
  );
};

const ConfigCardHeading: Component<{
  name: string;
}> = (props) => {
  const { t } = useI18n();

  return (
    <Flex flexDirection="column" gap="2">
      <Card.Title>{props.name}</Card.Title>
      <Card.Description>
        {t("configs.card.description", { name: props.name })}
      </Card.Description>
    </Flex>
  );
};
