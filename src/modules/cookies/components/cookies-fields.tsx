import type { Component } from "solid-js";
import { Flex } from "styled-system/jsx";
import { useI18n } from "~/modules/common/contexts/i18n";
import { FormLabel } from "~/ui/form-label";

type ReviewFieldsProps = {
  initialReview?: Review;
};

export const ReviewFields: Component<ReviewFieldsProps> = (props) => {
  const { t } = useI18n();

  return (
    <Flex flexDirection="column" padding="4">
      <FormLabel>
        {t("ReviewForm.textLabel")}
        <Input name="text" value={props.initialReview?.text ?? ""} />
      </FormLabel>
      <FormLabel>
        {t("ReviewForm.rateLabel")}
        <NumberInput
          name="rate"
          min={0}
          max={10}
          step={0.1}
          value={String(props.initialReview?.rate ?? 5)}
        />
      </FormLabel>
    </Flex>
  );
};
