const express = require("express");
const {
  getArticle,
  getAllArticles,
  postArticle,
  patchArticle,
} = require("../controllers/articles_controller");
const {
  getArticleComments,
  postComment,
} = require("../controllers/comments_controller");

const router = express.Router();

router.route("/").get(getAllArticles).post(postArticle);
router.route("/:article_id").get(getArticle).patch(patchArticle);
router.route("/:article_id/comments").get(getArticleComments).post(postComment);

module.exports = router;
