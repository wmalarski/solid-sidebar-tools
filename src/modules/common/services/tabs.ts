import { createResource } from "solid-js";

export const reloadChromeTab = async () => {
  await chrome.tabs.reload();
};

const getUrlOrigin = (url: string) => {
  return new URL(url).origin;
};

export const getCurrentUrl = async () => {
  const args = { active: true, lastFocusedWindow: true };
  const tabs = await chrome.tabs.query(args);
  const url = tabs[0]?.url;
  return url && getUrlOrigin(url);
};

export const getCurrentChromeTab = () => {
  return chrome.tabs.getCurrent();
};

export const getCurrentChromeTabUrl = async () => {
  const tab = await getCurrentChromeTab();
  return tab?.url;
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
      callback(getUrlOrigin(changeInfo.url));
    }
  };

  const onActivatedListener: OnActivatedListener = async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url && tab.active) {
      callback(getUrlOrigin(tab.url));
    }
  };

  chrome.tabs.onActivated.addListener(onActivatedListener);
  chrome.tabs.onUpdated.addListener(onUpdatedListener);

  createResource(async () => {
    const url = await getCurrentChromeTabUrl();
    url && callback(getUrlOrigin(url));
  });

  return () => {
    chrome.tabs.onActivated.removeListener(onActivatedListener);
    chrome.tabs.onUpdated.removeListener(onUpdatedListener);
  };
};
