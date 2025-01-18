import {
  type Accessor,
  type Component,
  createContext,
  createMemo,
  type ParentProps,
  useContext,
} from "solid-js";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { XIcon } from "./icons/x-icon";
import { Toast } from "./toast";

const createToasterContext = () => {
  return Toast.createToaster({
    placement: "bottom-end",
    overlap: true,
    duration: 2000,
    gap: 16,
  });
};

const ToasterContext = createContext<
  Accessor<ReturnType<typeof createToasterContext>>
>(() => {
  throw new Error("ToasterContext is not defined");
});

export const ToasterProvider: Component<ParentProps> = (props) => {
  const value = createMemo(() => createToasterContext());

  return (
    <ToasterContext.Provider value={value}>
      <Toast.Toaster toaster={value()}>
        {(toast) => (
          <Toast.Root>
            <Toast.Title>{toast().title}</Toast.Title>
            <Toast.Description>{toast().description}</Toast.Description>
            <Toast.ActionTrigger
              asChild={(actionProps) => (
                <Button {...actionProps()} variant="link" size="sm">
                  {toast().action?.label}
                </Button>
              )}
            />
            <Toast.CloseTrigger
              asChild={(closeProps) => (
                <IconButton {...closeProps()} size="sm" variant="link">
                  <XIcon />
                </IconButton>
              )}
            />
          </Toast.Root>
        )}
      </Toast.Toaster>
      {props.children}
    </ToasterContext.Provider>
  );
};

export const useToaster = () => {
  return useContext(ToasterContext);
};
