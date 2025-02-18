// background.js
const BACKEND_URL = "https://text-tools-chrome-extensoin-backend.onrender.com";

// Handle authentication
async function getAuthToken() {
  try {
    const extensionId = chrome.runtime.id;

    const response = await fetch(`${BACKEND_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extensionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }

    const data = await response.json();
    chrome.storage.local.set({ authToken: data.token });
    return data.token;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}

// Process text with JWT authentication
async function processText(text, task, targetLang = "") {
  try {
    // Get token from storage
    const result = await chrome.storage.local.get(["authToken"]);
    let token = result.authToken;

    if (!token) {
      token = await getAuthToken();
      if (!token) {
        return "Authentication error. Please reload the extension.";
      }
    }

    const response = await fetch(`${BACKEND_URL}/api/process-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text,
        task,
        targetLang,
      }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        // Try to refresh the token and retry once
        token = await getAuthToken();
        if (!token) {
          return "Failed to refresh authentication. Please reload the extension.";
        }

        // Retry with new token
        const retryResponse = await fetch(`${BACKEND_URL}/api/process-text`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            text,
            task,
            targetLang,
          }),
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json();
          throw new Error(
            error.error || "Failed to process text after token refresh"
          );
        }

        const retryData = await retryResponse.json();
        return retryData.result;
      }

      const error = await response.json();
      throw new Error(error.error || "Failed to process text");
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error:", error);
    return "Error processing text: " + error.message;
  }
}

// Initialize authentication on extension load
chrome.runtime.onInstalled.addListener(async () => {
  await getAuthToken();

  // Setup token renewal
  setInterval(async () => {
    await getAuthToken();
  }, 6 * 24 * 60 * 60 * 1000); // Renew token every 6 days
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "processText") {
    (async () => {
      const result = await processText(
        request.text,
        request.task,
        request.targetLang
      );
      sendResponse({ result });
    })();
    return true; // Required for async response
  }
});
