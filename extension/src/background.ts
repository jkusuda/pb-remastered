// Background service worker.
// Receives auth events from the content script and syncs to chrome.storage.local.

const SESSION_KEY = "pb_session";

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "POKEBROWSE_AUTH_TOKENS") {
    const { access_token, refresh_token } = message.payload;
    chrome.storage.local.set({ [SESSION_KEY]: { access_token, refresh_token } });
    sendResponse({ ok: true });
  }

  if (message?.type === "POKEBROWSE_AUTH_SIGNOUT") {
    chrome.storage.local.remove(SESSION_KEY);
    sendResponse({ ok: true });
  }

  return true;
});
