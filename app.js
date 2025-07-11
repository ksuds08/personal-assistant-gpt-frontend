const API = "https://assistant.promptpulse.workers.dev";
const chat = document.getElementById("chat");
const form = document.getElementById("form");
const input = document.getElementById("input");
const userId = localStorage.getItem("pa-user") || crypto.randomUUID();
localStorage.setItem("pa-user", userId);

function addBubble(role, content) {
  const div = document.createElement("div");
  div.className = role === "user"
    ? "self-end max-w-lg p-3 bg-indigo-600 text-white rounded-lg"
    : "self-start max-w-lg p-3 bg-gray-200 rounded-lg prose";
  div.innerHTML = role === "assistant" ? marked.parse(content) : content;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;
  input.value = "";
  addBubble("user", msg);

  try {
    const res = await fetch(`${API}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, message: msg })
    }).then(r => r.json());

    const assistantMsg = res.choices?.[0]?.message?.content || "(no reply)";
    addBubble("assistant", assistantMsg);
  } catch (err) {
    addBubble("assistant", "⚠️ Error contacting server.");
    console.error(err);
  }
});
