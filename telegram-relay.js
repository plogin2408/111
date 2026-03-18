const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

const CHATS = [
  -1001285120419,
  -1001987406047
];

// ---------- Новый тикет ----------

app.post("/youtrack", async (req, res) => {

  try {

    console.log("New issue:", JSON.stringify(req.body));

    const issue = req.body.issue;

    if (!issue) {
      return res.status(400).send("No issue data");
    }

    let issueId = "UNKNOWN";

    if (issue.url) {
      const parts = issue.url.split("/");
      issueId = parts[parts.length - 1];
    }

    const text =
`🆕 *Новый тикет*

*${issueId}*
${issue.summary || ""}

📂 Тип: ${issue.xtype || "—"}

🔗 ${issue.url || ""}`;

    for (const chat of CHATS) {

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: chat,
          text: text,
          parse_mode: "Markdown"
        }
      );

    }

    res.send("ok");

  } catch (err) {

    console.error("Issue error:", err);
    res.status(500).send("error");

  }

});


// ---------- Новый комментарий ----------

app.post("/youtrack-comment", async (req, res) => {

  try {

    console.log("New comment:", JSON.stringify(req.body));

    const comment = req.body.comment;

    if (!comment) {
      return res.status(400).send("No comment data");
    }

    let issueId = "UNKNOWN";

    if (comment.issueUrl) {
      const parts = comment.issueUrl.split("/");
      issueId = parts[parts.length - 1];
    }

    let textComment = comment.text || "";

    // обрезаем длинные комментарии
    if (textComment.length > 500) {
      textComment = textComment.substring(0, 500) + "...";
    }

    const text =
`💬 *Новый комментарий*

*${issueId}*
${comment.issueSummary || ""}

👤 ${comment.author || ""}

${textComment}

🔗 ${comment.issueUrl || ""}`;

    for (const chat of CHATS) {

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: chat,
          text: text,
          parse_mode: "Markdown"
        }
      );

    }

    res.send("ok");

  } catch (err) {

    console.error("Comment error:", err);
    res.status(500).send("error");

  }

});


app.listen(process.env.PORT || 3000, () => {
  console.log("Telegram relay started");
});
