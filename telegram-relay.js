const express = require("express");
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");

const app = express();
app.use(express.json());

const BOT_TOKEN = process.env.BOT_TOKEN;

const CHATS = [
  -1001285120419,
  -1001987406047
];

const proxyAgent = new HttpsProxyAgent("http://proxy.dd:3128");

app.post("/youtrack", async (req, res) => {

  try {

    const issue = req.body.issue;

    const text =
`🆕 Новый тикет

${issue.id}
${issue.summary}

${issue.url}`;

    for (const chat of CHATS) {

      await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          chat_id: chat,
          text: text
        },
        {
          httpsAgent: proxyAgent
        }
      );

    }

    res.send("ok");

  } catch (err) {

    console.log(err);
    res.status(500).send("error");

  }

});

app.listen(process.env.PORT || 3000);
