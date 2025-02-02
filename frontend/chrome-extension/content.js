// content.js
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDrxnN7Xbq24DC6vlw9fLOaUQGHFOVikbs";

// Create floating menu
const menu = document.createElement("div");
menu.className = "floating-menu";
menu.innerHTML = `
  <button data-action="rephrase">Rephrase</button>
  <button data-action="summarize">Summarize</button>
  <button data-action="grammar">Grammar</button>
  <button data-action="translate">Translate</button>
`;

// Create result popup
const popup = document.createElement("div");
popup.className = "result-popup";
popup.innerHTML = `
  <button class="close-button">×</button>
  <textarea readonly></textarea>
`;

document.body.appendChild(menu);
document.body.appendChild(popup);

// Handle text selection
document.addEventListener("mouseup", (e) => {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  if (selectedText) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // Position menu above selected text
    menu.style.left = `${
      window.scrollX + rect.left + rect.width / 2 - menu.offsetWidth / 2
    }px`;
    menu.style.top = `${window.scrollY + rect.top - menu.offsetHeight - 10}px`;
    menu.classList.add("visible");
  } else {
    menu.classList.remove("visible");
  }
});

// Hide menu when clicking outside
document.addEventListener("mousedown", (e) => {
  if (!menu.contains(e.target)) {
    menu.classList.remove("visible");
  }
});

// Process text
const processText = async (text, task) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: `here is the text, ${task}: ${text}` }],
          },
        ],
      }),
    });

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
  } catch (error) {
    console.error("Error:", error);
    return "Error processing text";
  }
};

// Handle button clicks
menu.addEventListener("click", async (e) => {
  const button = e.target.closest("button");
  if (!button) return;

  const selection = window.getSelection();
  const selectedText = selection.toString().trim();
  if (!selectedText) return;

  const action = button.dataset.action;
  const result = await processText(selectedText, action);

  // Show result in popup
  const textarea = popup.querySelector("textarea");
  textarea.value = result;
  popup.classList.add("visible");
});

// Close popup
popup.querySelector(".close-button").addEventListener("click", () => {
  popup.classList.remove("visible");
});

// Close popup when clicking outside
document.addEventListener("mousedown", (e) => {
  if (
    !popup.contains(e.target) &&
    e.target.closest(".floating-menu") === null
  ) {
    popup.classList.remove("visible");
  }
});
