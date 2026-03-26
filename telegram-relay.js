const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

const CHATS = [
  -1001285120419,
  -1001987406047
];

// ---------- utils ----------

async function sendMessage(buildPayload) {
  for (const chat of CHATS) {

    for (let i = 0; i < 3; i++) {
      try {

        await axios.post(
          `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
          buildPayload(chat)
        );

        break;

      } catch (e) {

        console.log(`Retry ${i + 1}`);

        if (i === 2) {
          console.error("Telegram error:", e.response?.data || e.message);
        }

        await new Promise(r => setTimeout(r, 2000));
      }
    }

  }
}

function getIssueId(url) {
  if (!url) return "UNKNOWN";
  const parts = url.split("/");
  return parts[parts.length - 1];
}

// ---------- новый тикет ----------

app.post("/youtrack", async (req, res) => {

  try {

    console.log("New issue:", JSON.stringify(req.body));

    const issue = req.body.issue;
    if (!issue) return res.status(400).send("No issue");

    const issueId = getIssueId(issue.url);

    const text =
`🆕 ${issueId}

${issue.summary || ""}

📂 ${issue.xtype || "—"}`;

    await sendMessage(chat => ({
      chat_id: chat,
      text,
      reply_markup: {
        inline_keyboard: [[
          {
            text: "🔗 Открыть тикет",
            url: issue.url
          }
        ]]
      }
    }));

    res.send("ok");

  } catch (err) {

    console.error("Issue error:", err);
    res.status(500).send("error");

  }

});

// ---------- новый комментарий ----------

app.post("/youtrack-comment", async (req, res) => {

  try {

    console.log("New comment:", JSON.stringify(req.body));

    const comment = req.body.comment;
    if (!comment) return res.status(400).send("No comment");

    const issueId = getIssue
