import { getCurrentUrl } from "~/modules/common/services/tabs";

export const getChromeTabCookies = async () => {
  const url = await getCurrentUrl();
  return url ? chrome.cookies.getAll({ url }) : [];
};

export const saveCookie = (
  cookie: Omit<chrome.cookies.SetDetails, "partitionKey" | "storeId">,
) => {
  return chrome.cookies.set(cookie);
};

export const removeCookie = (details: chrome.cookies.CookieDetails) => {
  return chrome.cookies.remove(details);
};
