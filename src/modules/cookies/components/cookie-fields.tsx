import type { Component } from "solid-js";
import { Flex } from "styled-system/jsx";
import { CookieNameTagInput } from "./cookie-name-tag-input";
import { CookieValuesFields } from "./cookie-values-fields";

type CookieFieldsData = {
  name: string;
  values: string[];
};

type CookieFieldProps = {
  initialData?: CookieFieldsData;
};

export const CookieFields: Component<CookieFieldProps> = (props) => {
  return (
    <Flex flexDirection="column" gap="4">
      <CookieNameTagInput />
      <CookieValuesFields initialValues={props.initialData?.values} />
    </Flex>
  );
};
