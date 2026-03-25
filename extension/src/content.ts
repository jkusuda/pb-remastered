// Content script injected on all website pages.
// Listens for postMessage events from ExtensionAuthBridge (on every page)
// and from login/page.tsx (on the login page), then relays them to the
// extension's background service worker.

window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  if (event.data?.type === "POKEBROWSE_AUTH_SUCCESS") {
    const { access_token, refresh_token } = event.data.payload ?? {};
    if (access_token && refresh_token) {
      chrome.runtime.sendMessage({
        type: "POKEBROWSE_AUTH_TOKENS",
        payload: { access_token, refresh_token },
      });
    }
  }

  if (event.data?.type === "POKEBROWSE_AUTH_SIGNOUT") {
    chrome.runtime.sendMessage({ type: "POKEBROWSE_AUTH_SIGNOUT" });
  }
});
