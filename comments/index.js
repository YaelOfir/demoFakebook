const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const Comment = require("./models/Comment");
const { startConnection } = require("./mongoConfig/connection");

const app = express();
app.use(bodyParser.json());
app.use(cors());
startConnection();

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/", async (req, res) => {
  const newComment = new Comment(req.body);
  try {
    const savedPost = await newComment.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
  });
});

// const content = new Comment(req.body);

// const postId = commentsByPostId[req.params.id] || [];

// content.save({ postId: postId, status: "pending" });

// commentsByPostId[req.params.id] = postId;

// await axios.post("http://localhost:4005/events", {
//   type: "CommentCreated",
//   data: {
//     content,
//     postId: postId,
//     status: "pending",
//   },
// });

//res.status(201).send(comments);
app.post("/events", async (req, res) => {
  console.log("Event Received:", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
