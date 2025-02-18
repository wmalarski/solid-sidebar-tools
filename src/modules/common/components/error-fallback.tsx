import { onMount } from "solid-js";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Button } from "~/ui/button";
import { Card } from "~/ui/card";
import { XCircleIcon } from "~/ui/icons/x-circle-icon";
import { useI18n } from "../contexts/i18n";

export const ErrorFallback = (err: unknown, reset: VoidFunction) => {
  const { t } = useI18n();

  onMount(() => {
    console.error("ERROR", err, (err as Error).stack);
  });

  return (
    <div class={flex({ pt: "8", justifyContent: "center", width: "full" })}>
      <Card.Root maxW="md" w="full">
        <Card.Header alignItems="center">
          <XCircleIcon
            class={css({ width: 10, height: 10, color: "colorPalette.error" })}
          />
          <Card.Title>{t("error.title")}</Card.Title>
        </Card.Header>
        <Card.Body>
          <span class={css({ textAlign: "center" })}>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {t("error.description", { message: (err as any)?.message })}
          </span>
        </Card.Body>
        <Card.Footer>
          <Button size="xs" onClick={reset}>
            {t("error.reload")}
          </Button>
        </Card.Footer>
      </Card.Root>
    </div>
  );
};
