const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

require("dotenv").config();

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

const API_URL = "https://books.google.com/ngrams";

if (app.get("env") === "production") {
  app.set("trust proxy", 1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);
app.use(compression());
app.use(cors({ origin: true }));
app.use(history());

app.use(
  express.static("dist/web", {
    maxAge: process.env.CACHE_MAX_AGE || "1d"
  })
);

app.get("/ngram", (req, res) => {
  const data = req.query;

  fetch(
    API_URL +
      "/json?" +
      new URLSearchParams({
        content: data.query,
        year_start: data.startYear,
        year_end: data.endYear,
        corpus: data.corpus,
        smoothing: data.smoothing || 0
      })
  )
    .then(async data => {
      res.json({ data: await data.json() });
    })
    .catch(err => {
      console.error(err);

      res.status(500).json(err);
    });
});

app.get("/corpuses", (req, res) => {
  fetch(API_URL)
    .then(async data => {
      const $ = cheerio.load(await data.text());
      const corpuses = [];

      $("#corpus-list > mwc-list-item").each((i, el) => {
        const children = el.children.filter(el => el.name === "span");

        if (children.length >= 2) {
          corpuses.push({
            name: $(children[0]).text(),
            year: $(children[1]).text(),
            value: el.attribs.value
          });
        }
      });

      res.json({ corpuses });
    })
    .catch(err => {
      console.error(err);

      res.status(500).json(err);
    });
});

app.listen(PORT, () => console.info(`Server running on port ${PORT}`));

process.on("unhandledReject", console.warn);
process.on("uncaughtException", console.error);
