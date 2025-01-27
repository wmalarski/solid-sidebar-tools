export const isChromeExtension = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const app = (chrome as any).app;
  return app ? app.isInstalled : true;
};
