export const isChromeExtension = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  return (chrome as any).app.isInstalled;
};
