const mongoConnect = require("mongoose");
const { connect } = mongoConnect;
require("dotenv").config();
const URI = process.env.MONGO_URI;

const logger = require("../logger");

module.exports.startConnection = async function startConnection() {
   await connect(URI,   {useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true})
    .then(() => {
      logger.info("mongoDb connected");
    })
    .catch((err) => {
      logger.error("mongoDB disconnected", err);
      console.log(err);
    });
};
