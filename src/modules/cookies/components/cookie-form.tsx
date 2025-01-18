import { decode } from "decode-formdata";
import type { Component, ComponentProps } from "solid-js";
import { flex } from "styled-system/patterns";
import * as v from "valibot";
import { CookieNameTagInput } from "./cookie-name-tag-input";
import { CookieValuesFields } from "./cookie-values-fields";

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
    event.currentTarget.reset();
  };

  return (
    <form
      onSubmit={onSubmit}
      id={props.id}
      class={flex({ flexDirection: "column", gap: 4 })}
    >
      <CookieNameTagInput />
      <CookieValuesFields initialValues={props.initialData?.values} />
    </form>
  );
};
