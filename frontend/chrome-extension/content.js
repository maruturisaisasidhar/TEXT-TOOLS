const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDrxnN7Xbq24DC6vlw9fLOaUQGHFOVikbs";

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
      <span>Smart Text Tools</span>
    </div>
  </div>
  <div class="menu-buttons">
    <button data-action="rephrase" class="action-btn">Rephrase</button>
    <button data-action="summarize" class="action-btn">Summarize</button>
    <button data-action="grammar" class="action-btn">Grammar</button>
    <button data-action="translate" class="action-btn translate-btn">Translate</button>
  </div>
  <div class="translate-options" style="display: none;">
    <select class="lang-select">
      ${Object.entries(LANGUAGES)
        .map(([code, name]) => `<option value="${code}">${name}</option>`)
        .join("")}
    </select>
  </div>
`;

const popup = document.createElement("div");
popup.className = "result-popup";
popup.innerHTML = `
  <div class="popup-header">
    <span class="popup-title">Result</span>
    <button class="close-button">X</button>
  </div>
  <textarea readonly></textarea>
  <div class="popup-actions">
    <button class="copy-button">Copy</button>
  </div>
`;

document.body.appendChild(menu);
document.body.appendChild(popup);

let selectedText = ""; // Store selected text globally

// Handle text selection
document.addEventListener("mouseup", (e) => {
  if (menu.contains(e.target) || popup.contains(e.target)) return;

  selectedText = "";
  let rect = null;

  if (
    e.target.matches('input[type="text"], textarea') ||
    e.target.isContentEditable
  ) {
    const element = e.target;
    const start = element.selectionStart;
    const end = element.selectionEnd;

    if (start !== end) {
      selectedText = element.value.substring(start, end);
      rect = element.getBoundingClientRect();
    }
  } else {
    const selection = window.getSelection();
    selectedText = selection.toString().trim();

    if (selectedText && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      rect = range.getBoundingClientRect();
    }
  }

  if (selectedText && rect) {
    menu.style.left = `${
      window.scrollX + rect.left + rect.width / 2 - menu.offsetWidth / 2
    }px`;
    menu.style.top = `${window.scrollY + rect.top - menu.offsetHeight - 10}px`;

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
// Handle language selection for translation
menu.querySelector(".lang-select").addEventListener("change", async (e) => {
  const targetLang = e.target.value;
  if (!selectedText) return;

  const result = await processText(selectedText, "translate", targetLang);
  showResult(result, "translate");
  menu.classList.remove("visible");
});

// Process text function (Fixed)
const processText = async (text, task, targetLang = "") => {
  try {
    let prompt = "";
    if (task === "translate") {
      // Ensure the selected language is valid
      if (!LANGUAGES[targetLang]) {
        return "Invalid language selection";
      }
      prompt = `Translate the following text to ${LANGUAGES[targetLang]}:\n${text}`;
    } else if (task === "rephrase") {
      prompt = `Rephrase this text in a clear and professional way:\n${text}`;
    } else if (task === "summarize") {
      prompt = `Provide a concise summary of this text:\n${text}`;
    } else if (task === "grammar") {
      prompt = `Check and correct any grammar issues in this text:\n${text}`;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (error) {
    console.error("Error:", error);
    return "Error processing text";
  }
};

// Handle button clicks (Fixed)
menu.addEventListener("click", async (e) => {
  const button = e.target.closest("button");
  if (!button || button.classList.contains("close-button")) return;

  const action = button.dataset.action;
  if (!selectedText) return;

  if (action === "translate") {
    // Get the selected language
    const targetLang = menu.querySelector(".lang-select").value;
    if (!targetLang) {
      alert("Please select a language first.");
      return;
    }

    const result = await processText(selectedText, "translate", targetLang);
    showResult(result, "translate");
  } else {
    const result = await processText(selectedText, action);
    showResult(result, action);
  }
});
