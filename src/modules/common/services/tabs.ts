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
