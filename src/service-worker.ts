const setPoputHtml = async () => {
  return chrome.action
    .setPopup({ popup: "popup.html" })
    .catch((error) => console.error(error));
};

if (!chrome.sidePanel) {
  setPoputHtml();
}

chrome.sidePanel
  ?.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => {
    console.error(error);
    return setPoputHtml();
  })
  .catch((error) => console.error(error));
