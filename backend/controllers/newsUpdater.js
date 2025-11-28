// controllers/newsUpdater.js
const cron = require("node-cron");
const axios = require("axios");
const prisma = require("../prisma-client");
require("dotenv").config();

// 🧠 Multiple smaller keyword sets (< 100 chars each)
const QUERIES = [
  "students OR education OR university OR college",
  "internship OR placements OR scholarships",
  "AI OR technology OR innovation OR startup",
];

const COUNTRY = "in";
const LANGUAGE = "en";

async function fetchAndStoreNews() {
  try {
    console.log("📰 Fetching latest student-relevant news...");

    for (const q of QUERIES) {
      console.log(`🔍 Fetching for query: "${q}"`);

      const response = await axios.get("https://newsdata.io/api/1/news", {
        params: {
          apikey: process.env.NEWS_API_KEY,
          q,
          country: COUNTRY,
          language: LANGUAGE,
        },
      });

      const articles = response.data.results || [];

      if (!articles.length) {
        console.log(`⚠️ No news found for "${q}".`);
        continue;
      }

      for (const article of articles) {
        const existing = await prisma.news.findFirst({
          where: { title: article.title },
        });

        if (!existing) {
          await prisma.news.create({
            data: {
              title: article.title?.slice(0, 255),
              content:
                article.content ||
                article.description ||
                "No content available.",
              excerpt:
                article.description?.slice(0, 250) ||
                "No excerpt available.",
              image:
                article.image_url ||
                article.urlToImage ||
                "http://localhost:3000/default-news.jpg",
              url: article.link || article.url || null,
              isPublished: true,
              publishedAt: new Date(article.pubDate || Date.now()),
              authorId: 1, // Change this if needed
            },
          });

          console.log(`✅ Added: ${article.title}`);
        }
      }
    }

    console.log("🎉 News update complete!");
  } catch (error) {
    console.error(
      "❌ Error fetching news:",
      error.response?.data || error.message
    );
  }
}

// 🕒 Schedule daily update at 9 AM
cron.schedule("0 9 * * *", () => {
  console.log("⏰ Running daily news update (9 AM)");
  fetchAndStoreNews();
});

module.exports = { fetchAndStoreNews };
