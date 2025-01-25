import {
  objectToArray,
  onStorageChange,
} from "~/modules/common/services/storage";

export type SavedCookie = {
  id: number;
  name: string;
  values: string[];
};

export const getSavedCookies = async (url: string) => {
  const data = await chrome.storage.local.get(url);
  const mapping = data?.[url]?.cookies ?? {};
  const result = objectToArray<SavedCookie>(mapping);

  return result.map<SavedCookie>((entry) => ({
    ...entry,
    values: objectToArray(entry.values),
  }));
};

export const setSavedCookies = (url: string, cookies: SavedCookie[]) => {
  return chrome.storage.local.set({ [url]: { cookies } });
};

export const onSavedCookiesChange = (
  url: string,
  callback: (cookies: SavedCookie[]) => void,
) => {
  return onStorageChange(url, (change) => {
    callback(change.newValue.cookies as SavedCookie[]);
  });
};
