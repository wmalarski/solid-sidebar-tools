import {
  objectToArray,
  onStorageChange,
} from "~/modules/common/services/storage";

export type SavedConfig = {
  id: number;
  name: string;
  kind: "locale" | "cookie";
  values: string[];
};

const STORAGE_CONFIG_KEY = "configs";

type StorageShape = {
  [STORAGE_CONFIG_KEY]: SavedConfig[];
};

export const getSavedConfig = async () => {
  const data = await chrome.storage.local.get<StorageShape>(STORAGE_CONFIG_KEY);
  const configs = data[STORAGE_CONFIG_KEY] ?? [];
  return configs.map<SavedConfig>((entry) => ({
    ...entry,
    values: objectToArray(entry.values),
  }));
};

export const setSavedConfig = (configs: SavedConfig[]) => {
  return chrome.storage.local.set<StorageShape>({
    [STORAGE_CONFIG_KEY]: configs,
  });
};

export const onSavedConfigChange = (
  callback: (configs: SavedConfig[]) => void,
) => {
  return onStorageChange(STORAGE_CONFIG_KEY, (change) => {
    callback(change.newValue as SavedConfig[]);
  });
};
