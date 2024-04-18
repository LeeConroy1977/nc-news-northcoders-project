const db = require("../db/connection");

async function fetchAllArticles(
  topic,
  sorted_by = "created_at",
  order = "desc"
) {
  if (topic) {
    if (!["mitch", "cats", "paper"].includes(topic)) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
  }
  if (
    ![
      "article_id",
      "title",
      "topic",
      "author",
      "body",
      "created_at",
      "votes",
    ].includes(sorted_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }
  if (!["asc", "desc"].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid query" });
  }

  let queryArray = [];
  let queryStr = `SELECT articles.author,title,articles.article_id,articles.topic,articles.created_at,articles.votes,article_img_url, COUNT(comments)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  if (topic) {
    queryArray.push(topic);
    queryStr += `WHERE articles.topic = $1 `;
  }
  queryStr += `GROUP BY articles.article_id ORDER BY ${sorted_by} ${order}`;

  const articles = await db.query(queryStr, queryArray);
  return articles.rows;
}

async function fetchArticle(article_id) {
  const article = await db.query(
    `SELECT articles.*, COUNT(comments.article_id)::INT AS comment_count FROM articles JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

  return article.rows[0];
}

async function updateArticle(article_id, inc_votes) {
  const article = await db.query(
    `UPDATE articles SET votes = votes + ${inc_votes} WHERE article_id = $1 RETURNING *`,
    [article_id]
  );

  return article.rows[0];
}

async function checkArticleExists(article_id) {
  const article = await db.query(
    `SELECT * FROM articles WHERE article_id = $1`,
    [article_id]
  );
  if (article.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "Artical does not exist" });
  }

  return article.rows[0];
}

module.exports = {
  fetchArticle,
  fetchAllArticles,
  checkArticleExists,
  updateArticle,
};
