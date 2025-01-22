import { type Accessor, createResource } from "solid-js";

const getCurrentChromeTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
};

const getCurrentChromeTabUrl = async () => {
  const tab = await getCurrentChromeTab();
  return tab.url;
};

export const getChromeTabCookies = (url: string) => {
  return chrome.cookies.getAll({ url });
};

export const saveCookie = (
  cookie: Pick<chrome.cookies.SetDetails, "name" | "value" | "url">,
) => {
  return chrome.cookies.set(cookie);
};

type OnUpdatedListener = Parameters<
  typeof chrome.tabs.onUpdated.addListener
>[0];

type OnActivatedListener = Parameters<
  typeof chrome.tabs.onActivated.addListener
>[0];

export const onCurrentUrlChange = (callback: (url: string) => void) => {
  const onUpdatedListener: OnUpdatedListener = (_tabId, changeInfo, tab) => {
    if (changeInfo.url && tab.active) {
      callback(changeInfo.url);
    }
  };

  const onActivatedListener: OnActivatedListener = async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.active) {
      callback(tab.url);
    }
  };

  chrome.tabs.onActivated.addListener(onActivatedListener);
  chrome.tabs.onUpdated.addListener(onUpdatedListener);

  createResource(async () => {
    const url = await getCurrentChromeTabUrl();
    url && callback(url);
  });

  return () => {
    chrome.tabs.onActivated.removeListener(onActivatedListener);
    chrome.tabs.onUpdated.removeListener(onUpdatedListener);
  };
};

export const reloadChromeTab = async () => {
  await chrome.tabs.reload();
};

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
  url: Accessor<string>,
  callback: (cookies: SavedCookie[]) => void,
) => {
  const listener: OnChangeListener = (changes) => {
    const resolvedUrl = url();
    const currentChanges = changes[resolvedUrl];

    if (currentChanges) {
      callback(changes[resolvedUrl].newValue.cookies as SavedCookie[]);
    }
  };

  chrome.storage.local.onChanged.addListener(listener);
  return () => chrome.storage.local.onChanged.removeListener(listener);
};
