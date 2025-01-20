const getCurrentChromeTab = async () => {
  const [tab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  return tab;
};

export const getCurrentChromeTabUrl = async () => {
  const tab = await getCurrentChromeTab();
  return tab.url;
};

export const getChromeTabCookies = (url: string) => {
  return chrome.cookies.getAll({ url });
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

  return () => {
    chrome.tabs.onActivated.removeListener(onActivatedListener);
    chrome.tabs.onUpdated.removeListener(onUpdatedListener);
  };
};

export type SavedCookie = {
  name: string;
  values: string[];
};

export const getSavedCookies = async (url: string) => {
  const data = await chrome.storage.local.get(url);
  console.log({ data });
  return data as SavedCookie[];
};

export const setSavedCookies = (url: string, data: SavedCookie[]) => {
  return chrome.storage.local.set({ [url]: data });
};
