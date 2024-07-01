"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");
const { getDatabaseUri } = require("./config");

let dbClient = null;

async function connectToDb() {
  if (!dbClient) {
    if (process.env.NODE_ENV === "production") {
      console.log("production db connecting");
      dbClient = new Client({
        connectionString: getDatabaseUri(),
        ssl: {
          rejectUnauthorized: false,
        },
      });
    } else {
      console.log("dev db connecting");
      dbClient = new Client({
        connectionString: getDatabaseUri(),
      });
    }

    await dbClient.connect();
  }
  return dbClient;
}

// Initialize the connection and store the client
connectToDb()
  .then((client) => {
    dbClient = client;
    console.log("Database connected!");
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
    process.exit(1);
  });

module.exports = {
  getDb: connectToDb,
};
