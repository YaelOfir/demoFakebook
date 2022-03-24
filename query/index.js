const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const users = {};

const handleEvent = (type, data) => {
  if (type === "ProfilePosts") {
    const currentUser = await users.findById(req.params.userId);
    const userPosts = await posts.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return posts.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  }

  if (type === "UserCreated") {
    const { userId, name, email, password } = data;
    users[userId] = { userId, name, email, password };
  }

  if (type === "UserUpdated") {
    const { userId, name, email, password, city } = data;

    const user = users[userId];
    const updatedUser = user.users.find((user) => {
      return updatedUser.id === userId;
    });
    updatedUser.name = name;
    updatedUser.city = city;
  }

  if (type === "PostCreated") {
    const { userId, postId, title, file } = data;

    const user = users[userId];
    user.posts.push({ userId, postId, title, file, comments: [] });
    //posts[id] = { id, title, file, comments: [] };
  }

  if (type === "CommentCreated") {
    const { userId, commentId, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ userId, commentId, content, postId, status });
  }

  if (type === "CommentUpdated") {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4002, async () => {
  console.log("Listening on 4002");
  try {
    const res = await axios.get("http://localhost:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);

      handleEvent(event.type, event.data);
    }
  } catch (error) {
    console.log(error.message);
  }
});
