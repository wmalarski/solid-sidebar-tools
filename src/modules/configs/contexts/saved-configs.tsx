import type { Component } from "solid-js";
import {
  type Accessor,
  createContext,
  createMemo,
  createResource,
  onCleanup,
  type ParentProps,
  useContext,
} from "solid-js";
import { useCurrentUrlContext } from "~/modules/common/contexts/current-url";
import {
  getSavedConfig,
  onSavedConfigChange,
  type SavedConfig,
  setSavedConfig,
} from "../services/storage";

const createSavedConfigsContext = (url: string) => {
  const [savedConfigs, { mutate }] = createResource(
    () => url,
    (url) => getSavedConfig(url),
  );

  const add = async (config: Omit<SavedConfig, "id">) => {
    const resolvedConfigs = savedConfigs() ?? [];
    const maxId = resolvedConfigs.reduce(
      (previous, current) => Math.max(previous, current.id),
      0,
    );
    const newEntry = { id: maxId + 1, ...config };
    const updated = [...resolvedConfigs, newEntry];
    await setSavedConfig(url, updated);
  };

  const update = async (config: SavedConfig) => {
    const resolvedConfigs = savedConfigs() ?? [];
    const updated = resolvedConfigs.map((entry) =>
      entry.id === config.id ? config : entry,
    );
    await setSavedConfig(url, updated);
  };

  const remove = async (id: number) => {
    const resolvedConfigs = savedConfigs() ?? [];
    const updated = resolvedConfigs.filter((entry) => entry.id !== id);
    await setSavedConfig(url, updated);
  };

  const subscription = onSavedConfigChange(url, mutate);
  onCleanup(() => subscription());

  return { get: savedConfigs, add, update, remove };
};

const SavedConfigsContext = createContext<
  Accessor<ReturnType<typeof createSavedConfigsContext>>
>(() => {
  throw new Error("SavedConfigsContext is not defined");
});

export const SavedConfigsContextProvider: Component<ParentProps> = (props) => {
  const currentUrlContext = useCurrentUrlContext();

  const value = createMemo(() =>
    createSavedConfigsContext(currentUrlContext().url()),
  );

  return (
    <SavedConfigsContext.Provider value={value}>
      {props.children}
    </SavedConfigsContext.Provider>
  );
};

export const useSavedConfigsContext = () => {
  return useContext(SavedConfigsContext);
};
