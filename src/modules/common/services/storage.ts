// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const objectToArray = <T>(object: any) => {
  return Array.from<T>(Object.values(object));
};

type OnChangeListener = Parameters<
  typeof chrome.storage.local.onChanged.addListener
>[0];

export const onStorageChange = (
  url: string,
  callback: (change: chrome.storage.StorageChange) => void,
) => {
  const listener: OnChangeListener = (changes) => {
    const currentChanges = changes[url];
    currentChanges && callback(currentChanges);
  };

  chrome.storage.local.onChanged.addListener(listener);
  return () => chrome.storage.local.onChanged.removeListener(listener);
};
