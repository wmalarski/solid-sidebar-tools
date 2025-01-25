export type SavedCookie = {
  id: number;
  name: string;
  values: string[];
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const objectToArray = <T>(object: any) => {
  return Array.from<T>(Object.values(object));
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

type OnChangeListener = Parameters<
  typeof chrome.storage.local.onChanged.addListener
>[0];

export const onSavedCookiesChange = (
  url: string,
  callback: (cookies: SavedCookie[]) => void,
) => {
  const listener: OnChangeListener = (changes) => {
    const currentChanges = changes[url];

    if (currentChanges) {
      callback(changes[url].newValue.cookies as SavedCookie[]);
    }
  };

  chrome.storage.local.onChanged.addListener(listener);
  return () => chrome.storage.local.onChanged.removeListener(listener);
};
