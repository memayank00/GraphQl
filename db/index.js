const mongoose = require("mongoose");
require("dotenv").config();
const { loadDbConfig } = require("../config/ssm");

class Database {
  constructor() {
    this.connection = null;
    this._connect();
  }

  async _connect() {
    if (this.connection) return;

    const env = process.env.NODE_ENV || "development";
    let mongoUri;

    if (env === "production") {
      try {
        console.log("🔑 Fetching MongoDB credentials from AWS SSM...");
        const { username, password, url } = await loadDbConfig();

        mongoUri = `mongodb+srv://${username}:${password}@${url}?retryWrites=true&w=majority&appName=AWSGraphQl`;
      } catch (err) {
        console.error("❌ Failed to fetch DB credentials from SSM:", err);
        process.exit(1);
      }
    } else {
      // Local development: use .env or fallback
       mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/graphqldb";
    }

    console.log("Mongo URI:", mongoUri);

    mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("✅ Database connection successful");
        this.connection = mongoose.connection;
      })
      .catch((err) => {
        console.error("❌ Database connection error:", err);
      });
  }
}

module.exports = new Database();
