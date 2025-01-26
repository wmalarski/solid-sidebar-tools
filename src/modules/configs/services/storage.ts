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

export const getSavedConfig = async (url: string) => {
  const data = await chrome.storage.local.get(url);
  const mapping = data?.[url]?.configs ?? {};
  const result = objectToArray<SavedConfig>(mapping);

  return result.map<SavedConfig>((entry) => ({
    ...entry,
    values: objectToArray(entry.values),
  }));
};

export const setSavedConfig = (url: string, configs: SavedConfig[]) => {
  return chrome.storage.local.set({ [url]: { configs } });
};

export const onSavedConfigChange = (
  url: string,
  callback: (configs: SavedConfig[]) => void,
) => {
  return onStorageChange(url, (change) => {
    callback(change.newValue.configs as SavedConfig[]);
  });
};
