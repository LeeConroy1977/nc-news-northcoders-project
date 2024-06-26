const express = require("express");
const app = express();
const cors = require("cors");
const errorHandler = require("./middleware/error_middleware");
const topicsRouter = require("./routes/topics_router");
const apiRouter = require("./routes/api_router");
const articlesRouter = require("./routes/articles_router");
const commentsRouter = require("./routes/comments_router");
const usersRouter = require("./routes/users_router");
// Middleware

app.use(express.json());
app.use(cors());

// Routes

app.use("/api", apiRouter);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

// Error middleware

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Invalid Endpoint" });
});

app.use(errorHandler);

module.exports = app;
