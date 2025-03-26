import { decode } from "decode-formdata";
import {
  type Component,
  type ComponentProps,
  createMemo,
  createSignal,
} from "solid-js";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import {
  ConfigNameTagInput,
  type ConfigValues,
} from "~/modules/configs/dialogs/config-name-tag-input";
import { ConfigValuesFields } from "~/modules/configs/dialogs/config-values-fields";

export type ConfigFormData = {
  name: string;
  values: string[];
};

export const ConfigForm: Component<{
  id: string;
  initialData?: ConfigFormData;
  onSubmit: (data: ConfigFormData) => void;
  configValues: ConfigValues[];
}> = (props) => {
  const initialValues = createMemo(() => {
    const [get, set] = createSignal(props.initialData?.values);
    return { get, set };
  });

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const parsed = v.safeParse(
      v.object({ name: v.string(), values: v.array(v.string()) }),
      decode(formData, { arrays: ["values"] }),
    );

    if (!parsed.success) {
      return;
    }

    props.onSubmit(parsed.output);
  };

  const onValueChange = (value: string) => {
    initialValues().set([value]);
  };

  return (
    <form
      class={flex({ flexDirection: "column", gap: 4 })}
      id={props.id}
      onSubmit={onSubmit}
    >
      <ConfigNameTagInput
        configValues={props.configValues}
        initialValue={props.initialData?.name}
        onValueChange={onValueChange}
      />
      <ConfigValuesFields initialValues={initialValues().get()} />
    </form>
  );
};
