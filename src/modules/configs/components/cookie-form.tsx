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
} from "~/modules/configs/components/config-name-tag-input";
import { ConfigValuesFields } from "~/modules/configs/components/config-values-fields";

export type ConfigFormData = {
  name: string;
  values: string[];
};

type ConfigFormProps = {
  id: string;
  initialData?: ConfigFormData;
  onSubmit: (data: ConfigFormData) => void;
  configValues: ConfigValues[];
};

export const ConfigForm: Component<ConfigFormProps> = (props) => {
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
      onSubmit={onSubmit}
      id={props.id}
      class={flex({ flexDirection: "column", gap: 4 })}
    >
      <ConfigNameTagInput
        initialValue={props.initialData?.name}
        onValueChange={onValueChange}
        configValues={props.configValues}
      />
      <ConfigValuesFields initialValues={initialValues().get()} />
    </form>
  );
};
