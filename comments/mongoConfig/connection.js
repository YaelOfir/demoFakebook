const pkg = require("mongoose");
const { connect } = pkg;
require("dotenv").config()
const URI = process.env.MONGO_URI;


const logger=require("../logger")


module.exports.startConnection = async function startConnection() {
  const db = await
    connect(URI)
      .then(() => {
        logger.info("mongoDb connected");
      
      })
      .catch((err) => { 
        logger.error("mongoDB disconnected", err)
        console.log(err); });
}
