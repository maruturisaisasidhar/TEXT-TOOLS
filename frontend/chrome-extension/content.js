// content.js
const BACKEND_URL = "http://localhost:3000"; // Update to your deployed URL when ready

const LANGUAGES = {
  en: "English",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
};

// Create floating menu
const menu = document.createElement("div");
menu.className = "floating-menu";
menu.innerHTML = `
  <div class="menu-header">
    <div class="menu-logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Smart Text Tools</span>
    </div>
  </div>
  <div class="menu-buttons">
    <button data-action="rephrase" class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z"></path>
      </svg>
      Rephrase
    </button>
    <button data-action="summarize" class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="18" x2="12" y2="18"></line>
      </svg>
      Summarize
    </button>
    <button data-action="grammar" class="action-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m16 6 4 14"></path>
        <path d="M12 6v14"></path>
        <path d="M8 8v12"></path>
        <path d="M4 4v16"></path>
      </svg>
      Grammar
    </button>
    <button data-action="translate" class="action-btn translate-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="m5 8 6 6"></path>
        <path d="m4 14 6-6 2-3"></path>
        <path d="M2 5h12"></path>
        <path d="M7 2h1"></path>
        <path d="m22 22-5-10-5 10"></path>
        <path d="M14 18h6"></path>
      </svg>
      Translate
    </button>
  </div>
  <div class="translate-options" style="display: none;">
    <select class="lang-select">
      ${Object.entries(LANGUAGES)
        .map(([code, name]) => `<option value="${code}">${name}</option>`)
        .join("")}
    </select>
  </div>
`;

// Create result popup
const popup = document.createElement("div");
popup.className = "result-popup";
popup.innerHTML = `
  <div class="popup-header">
    <div class="popup-logo">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    </div>
    <span class="popup-title">Result</span>
    <button class="close-button" aria-label="Close">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
  <textarea readonly></textarea>
  <div class="popup-actions">
    <button class="copy-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
      </svg>
      Copy to Clipboard
    </button>
  </div>
`;

document.body.appendChild(menu);
document.body.appendChild(popup);

// Get JWT token on extension initialization
async function getAuthToken() {
  try {
    // For Chrome extension, use chrome.runtime.id
    const extensionId =
      typeof chrome !== "undefined" && chrome.runtime
        ? chrome.runtime.id
        : "test-extension-id";

    const response = await fetch(`${BACKEND_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ extensionId }),
    });

    if (!response.ok) {
      throw new Error("Failed to authenticate");
    }

    const data = await response.json();
    localStorage.setItem("authToken", data.token);
    console.log("Authentication successful");
  } catch (error) {
    console.error("Authentication error:", error);
  }
}

// Initialize on load
(async function init() {
  await getAuthToken();
})();

// Process text with JWT authentication
const processText = async (text, task, targetLang = "") => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.error("No authentication token found");
      return "Authentication error. Please reload the extension.";
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
        await getAuthToken();

        const token = localStorage.getItem("authToken");
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
};

// Handle text selection
document.addEventListener("mouseup", (e) => {
  // Skip if clicked on the menu or popup
  if (menu.contains(e.target) || popup.contains(e.target)) return;

  let selectedText = "";
  let range;
  let rect;

  // Handle contenteditable and text inputs
  if (
    e.target.matches('input[type="text"], textarea') ||
    e.target.isContentEditable
  ) {
    const element = e.target;
    const start = element.selectionStart;
    const end = element.selectionEnd;

    if (start !== end) {
      selectedText = element.value.substring(start, end);
      // Create a temporary range for positioning
      const tempRange = document.createRange();
      const tempNode = document.createTextNode(selectedText);
      element.parentNode.insertBefore(tempNode, element);
      tempRange.selectNode(tempNode);
      rect = tempRange.getBoundingClientRect();
      element.parentNode.removeChild(tempNode);
    }
  } else {
    // Handle regular text selection
    const selection = window.getSelection();
    selectedText = selection.toString().trim();
    if (selectedText && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    }
  }

  if (selectedText && rect) {
    // Position menu above selected text
    menu.style.left = `${
      window.scrollX + rect.left + rect.width / 2 - menu.offsetWidth / 2
    }px`;
    menu.style.top = `${window.scrollY + rect.top - menu.offsetHeight - 10}px`;

    // Ensure menu stays within viewport
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.left < 0) menu.style.left = "10px";
    if (menuRect.right > window.innerWidth) {
      menu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
    }

    menu.classList.add("visible");
    menu.querySelector(".translate-options").style.display = "none";
  } else {
    menu.classList.remove("visible");
  }
});

// Handle translate button click
menu.querySelector(".translate-btn").addEventListener("click", (e) => {
  e.stopPropagation();
  const translateOptions = menu.querySelector(".translate-options");
  translateOptions.style.display =
    translateOptions.style.display === "none" ? "block" : "none";
});

// Handle button clicks
menu.addEventListener("click", async (e) => {
  const button = e.target.closest("button");
  if (!button || button.classList.contains("close-button")) return;

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const action = button.dataset.action;

  // Skip for translate button - handled separately
  if (action === "translate") {
    return;
  }

  const result = await processText(selectedText, action);
  showResult(result, action);
});

// Handle language selection
menu.querySelector(".lang-select").addEventListener("change", async (e) => {
  const targetLang = e.target.value;
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    const result = await processText(selectedText, "translate", targetLang);
    showResult(result, "translate");
    menu.classList.remove("visible");
  }
});

function showResult(result, action) {
  const textarea = popup.querySelector("textarea");
  const popupTitle = popup.querySelector(".popup-title");

  textarea.value = result;
  popupTitle.textContent =
    action.charAt(0).toUpperCase() + action.slice(1) + " Result";

  popup.classList.add("visible");

  const rect = popup.getBoundingClientRect();
  popup.style.top = `${window.innerHeight / 2 - rect.height / 2}px`;
  popup.style.left = `${window.innerWidth / 2 - rect.width / 2}px`;
}

// Copy to clipboard functionality
popup.querySelector(".copy-button").addEventListener("click", () => {
  const textarea = popup.querySelector("textarea");
  textarea.select();
  document.execCommand("copy");

  const copyButton = popup.querySelector(".copy-button");
  const originalText = copyButton.textContent;
  copyButton.textContent = "Copied!";
  setTimeout(() => {
    copyButton.textContent = originalText;
  }, 2000);
});

// Close popup
popup.querySelector(".close-button").addEventListener("click", () => {
  popup.classList.remove("visible");
});

// Close popup when clicking outside
document.addEventListener("mousedown", (e) => {
  if (!popup.contains(e.target) && !menu.contains(e.target)) {
    popup.classList.remove("visible");
    menu.classList.remove("visible");
  }
});

// Handle escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    popup.classList.remove("visible");
    menu.classList.remove("visible");
  }
});

// Token renewal process - refresh token every 6 days
function setupTokenRenewal() {
  // Renew token every 6 days (before 7-day expiration)
  setInterval(async () => {
    await getAuthToken();
  }, 6 * 24 * 60 * 60 * 1000);
}

setupTokenRenewal();
