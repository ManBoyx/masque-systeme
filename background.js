const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const LANG = "en-US,en;q=0.9";

const strip = ["sec-ch-ua-platform-version", "sec-ch-ua-full-version-list", "sec-ch-ua-full-version",
  "sec-ch-ua-arch", "sec-ch-ua-model", "sec-ch-ua-bitness", "sec-ch-ua-wow64"];

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [{
      id: 1,
      priority: 1,
      condition: { urlFilter: "|http", resourceTypes: [
        "main_frame", "sub_frame", "xmlhttprequest", "script", "image", "stylesheet",
        "font", "media", "websocket", "ping", "other"] },
      action: {
        type: "modifyHeaders",
        requestHeaders: [
          { header: "user-agent", operation: "set", value: UA },
          { header: "accept-language", operation: "set", value: LANG },
          { header: "sec-ch-ua-platform", operation: "set", value: '"Windows"' },
          { header: "sec-ch-ua-mobile", operation: "set", value: "?0" },
          ...strip.map(h => ({ header: h, operation: "remove" }))
        ]
      }
    }]
  });
});

// Empêche la fuite d'IP locale/publique via WebRTC.
chrome.privacy.network.webRTCIPHandlingPolicy.set({ value: "disable_non_proxied_udp" });
