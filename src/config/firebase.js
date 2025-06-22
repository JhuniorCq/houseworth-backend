import fs from "node:fs/promises";
import admin from "firebase-admin";
import path from "node:path";

const serviceAccountKeyPath = path.resolve(
  "src",
  "config",
  "credentials",
  "serviceAccountKey.json"
);

const serviceAccountKeyJSON = await fs.readFile(serviceAccountKeyPath, "utf-8");

const serviceAccountKeyObject = JSON.parse(serviceAccountKeyJSON);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKeyObject),
});

export default admin;
