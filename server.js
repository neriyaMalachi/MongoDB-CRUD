import express from "express";
import "dotenv/config";
import { connectMongo } from "./DB/connection.js";
import { ObjectId } from "mongodb";

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8000;

app.get("/", async (req, res) => {
  await connectMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  });

  res.json({ ok: true, msg: "API is running" });
});

app.post("/users", async (req, res) => {
  let db = await connectMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  });
  const result = await db.collection("users").insertOne(req.body);
  res.json({ id: result.insertedId });
});

app.get("/users", async (req, res) => {
  let db = await connectMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  });
  const users = await db.collection("users").find().toArray();
  res.json(users);
});

app.get("/users/:name", async (req, res) => {
  let db = await connectMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  });
  const user = await db.collection("users").findOne({ name: req.params.name });

  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

app.put("/users/:name", async (req, res) => {
  let db = await connectMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  });
  await db
    .collection("users")
    .updateOne({ name: req.params.name }, { $set: req.body });
  res.json({ message: "User updated" });
});

app.delete("/users/:name", async (req, res) => {
  let db = await connectMongo({
    uri: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
  });
  await db.collection("users").deleteOne({
    name: req.params.name,
  });
  res.json({ message: "User deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
