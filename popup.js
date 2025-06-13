const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("You", userMessage);
  input.value = "";

  try {
    const response = await fetch("https://n8n.creativenour.tech/webhook/8fd26228-bda4-4aaf-a9d6-1ce049cc34b9", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from n8n");
    }

    const text = await response.text();
    let reply;

    try {
      const json = JSON.parse(text);
      reply = json.response || json.reply || JSON.stringify(json, null, 2);
    } catch (err) {
      reply = text || "(empty response)";
    }

    // Format line breaks
    reply = reply.replace(/\n/g, "<br>");

    appendMessage("Canvas Assistant", reply);
  } catch (err) {
    appendMessage("Error", err.message);
  }
});

function appendMessage(sender, htmlContent) {
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `<strong>${sender}:</strong> ${htmlContent}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}
