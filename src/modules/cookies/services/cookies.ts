export const getChromeTabCookies = (url: string) => {
  return chrome.cookies.getAll({ url });
};

export const saveCookie = (
  cookie: Omit<chrome.cookies.SetDetails, "partitionKey" | "storeId">,
) => {
  return chrome.cookies.set(cookie);
};
