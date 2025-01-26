import { decode } from "decode-formdata";
import {
  type Component,
  type ComponentProps,
  createMemo,
  createSignal,
} from "solid-js";
import * as v from "valibot";
import { useCurrentUrlContext } from "~/modules/common/contexts/current-url";
import {
  ConfigCardFooter,
  ConfigCardForm,
  ConfigCardHeader,
  ConfigCardHeading,
} from "~/modules/configs/components/config-card";
import { ConfigFields } from "~/modules/configs/components/config-fields";
import { Card } from "~/ui/card";
import { reloadChromeTab } from "../../common/services/tabs";
import type { SavedConfig } from "../../configs/services/storage";
import { saveCookie } from "../services/cookies";
import { CookieAdvancedFields } from "./cookie-advanced-fields";
import { CookieCardMenu } from "./cookie-card-menu";

type CookieCardProps = {
  cookie: SavedConfig;
  tabCookie?: chrome.cookies.Cookie;
};

export const CookieCard: Component<CookieCardProps> = (props) => {
  const currentUrlContext = useCurrentUrlContext();
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
      url: currentUrlContext().url(),
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
      <ConfigCardHeader>
        <ConfigCardHeading name={props.cookie.name} />
        <CookieCardMenu
          cookie={props.cookie}
          onShowAdvancedClick={onShowAdvancedClick}
          showAdvanced={showAdvanced()}
        />
      </ConfigCardHeader>
      <ConfigCardForm
        id={formId()}
        onChange={onFormChange}
        onSubmit={onFormSubmit}
      >
        <ConfigFields cookie={props.cookie} value={props.tabCookie?.value} />
        <CookieAdvancedFields
          isOpen={showAdvanced()}
          onOpenChange={setShowAdvanced}
        />
      </ConfigCardForm>
      <ConfigCardFooter formId={formId()} isDirty={isDirty()} />
    </Card.Root>
  );
};
