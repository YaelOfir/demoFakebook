const express = require("express");
const bodyParser = require("body-parser");
const postRouter = require("./routes/postRoute");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const { startConnection } = require("./mongoConfig/connection");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
app.use(bodyParser.json());
app.use(cors());
startConnection();
app.use("/images", express.static(path.join(__dirname)));
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});

// app.use(express.static("public"));

// const posts = {};

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "public");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

// const upload = multer({ storage }).array("file");

// app.post("/upload", (req, res) => {
//   upload(req, res, (err) => {
//     if (err) {
//       return res.status(500).json(err);
//     }

//     return res.status(200).send(req.files);
//   });
// });

// app.get("/posts", (req, res) => {
//   res.send(posts);
// });

// app.post("/posts", async (req, res) => {
//   const id = randomBytes(4).toString("hex");
//   const title = req.body.title;
//   const file = req.files;
//   posts[id] = {
//     id,
//     title,
//     file,
//   };

//   await axios.post("http://localhost:4005/events", {
//     type: "PostCreated",
//   });

//   res.status(201).send(posts[id]);
// });

// app.post("/events", (req, res) => {
//   console.log("Received Event", req.body.type);

//   res.send({});
// });

app.use("/post/", postRouter);
app.listen(4000, () => {
  console.log("Listening on 4000");
});
