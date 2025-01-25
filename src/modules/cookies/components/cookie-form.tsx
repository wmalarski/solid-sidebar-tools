import { decode } from "decode-formdata";
import {
  createMemo,
  createSignal,
  type Component,
  type ComponentProps,
} from "solid-js";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { ConfigNameTagInput } from "~/modules/configs/components/config-name-tag-input";
import { ConfigValuesFields } from "~/modules/configs/components/config-values-fields";
import { useCookiesContext } from "./cookies-context";

export type CookieFormData = {
  name: string;
  values: string[];
};

type CookieFormProps = {
  id: string;
  initialData?: CookieFormData;
  onSubmit: (data: CookieFormData) => void;
};

export const CookieForm: Component<CookieFormProps> = (props) => {
  const cookiesContext = useCookiesContext();

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

  const onCookieValueChange = (value: string) => {
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
        onValueChange={onCookieValueChange}
        values={cookiesContext().tabCookies() ?? []}
      />
      <ConfigValuesFields initialValues={initialValues().get()} />
    </form>
  );
};
