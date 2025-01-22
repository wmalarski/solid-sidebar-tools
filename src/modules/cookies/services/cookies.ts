export const getChromeTabCookies = (url: string) => {
  return chrome.cookies.getAll({ url });
};

export const saveCookie = (
  cookie: Pick<chrome.cookies.SetDetails, "name" | "value" | "url">,
) => {
  return chrome.cookies.set(cookie);
};
