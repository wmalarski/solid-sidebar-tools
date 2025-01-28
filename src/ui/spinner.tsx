import { createMemo, splitProps } from "solid-js";
import { styled } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import {
  Spinner as StyledSpinner,
  type SpinnerProps as StyledSpinnerProps,
} from "./styled/spinner";

interface SpinnerProps extends StyledSpinnerProps {
  /**
   * For accessibility, it is important to add a fallback loading text.
   * This text will be visible to screen readers.
   * @default "Loading..."
   */
  label?: string;
}

export const Spinner = (props: SpinnerProps) => {
  const { t } = useI18n();

  const [localProps, rootProps] = splitProps(props, ["label"]);
  const label = createMemo(() => localProps.label ?? t("common.loading"));

  return (
    <StyledSpinner
      borderBottomColor="transparent"
      borderLeftColor="transparent"
      {...rootProps}
    >
      <styled.span srOnly>{label()}</styled.span>
    </StyledSpinner>
  );
};
