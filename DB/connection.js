import { MongoClient } from "mongodb";

let client;
let db;

export async function connectMongo({ uri, dbName }) {
  if (db) return db; // return connection
  client = new MongoClient(uri);
  await client.connect();
  db = client.db(dbName);
  console.log("MongoDB connected:", db.databaseName);
  return db;
}
