import { decode } from "decode-formdata";
import {
  type Component,
  type ComponentProps,
  createMemo,
  createSignal,
} from "solid-js";
import { Flex } from "styled-system/jsx";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { useI18n } from "~/modules/common/contexts/i18n";
import { ConfigFields } from "~/modules/configs/components/config-fields";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import { saveCookie } from "../services/cookies";
import type { SavedCookie } from "../services/storage";
import { reloadChromeTab } from "../services/tabs";
import { CookieAdvancedFields } from "./cookie-advanced-fields";
import { CookieCardMenu } from "./cookie-card-menu";
import { useCookiesContext } from "./cookies-context";

type CookieCardProps = {
  cookie: SavedCookie;
  tabCookie?: chrome.cookies.Cookie;
};

export const CookieCard: Component<CookieCardProps> = (props) => {
  const { t } = useI18n();

  const cookiesContext = useCookiesContext();
  const formId = createMemo(() => `cookie-form-${props.cookie.name}`);

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

    await saveCookie({
      url: cookiesContext().url(),
      name: props.cookie.name,
      value: parsed.output.value,
    });

    await reloadChromeTab();
  };

  const onShowAdvancedClick = () => {
    setShowAdvanced((current) => !current);
  };

  return (
    <Card.Root>
      <Card.Header p={3} display="grid" gridTemplateColumns="1fr auto">
        <Flex flexDirection="column" gap="2">
          <Card.Title>{props.cookie.name}</Card.Title>
          <Card.Description>
            {t("cookies.list.cardDescription", { name: props.cookie.name })}
          </Card.Description>
        </Flex>
        <CookieCardMenu
          cookie={props.cookie}
          onShowAdvancedClick={onShowAdvancedClick}
          showAdvanced={showAdvanced()}
        />
      </Card.Header>
      <Card.Body px={3} pb={2}>
        <form
          id={formId()}
          class={flex({ flexDirection: "column", gap: 4 })}
          onChange={onFormChange}
          onSubmit={onFormSubmit}
        >
          <ConfigFields cookie={props.cookie} value={props.tabCookie?.value} />
          <CookieAdvancedFields
            isOpen={showAdvanced()}
            onOpenChange={setShowAdvanced}
          />
        </form>
      </Card.Body>
      <Card.Footer px={3} pt={1} pb={3} gap="3">
        <Button size="xs" disabled={!isDirty()} form={formId()}>
          {t("common.save")}
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};
