// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import cards from "./routes/cards";
import tracks from "./routes/tracks";
import teams from "./routes/teams";
import drivers from "./routes/drivers";
import profiles from "./routes/profiles";
import auth, { authenticateUser } from "./routes/auth";
import fs from "node:fs/promises";
import path from "path";

connect("LuminarDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.use("/api/cards", authenticateUser, cards);
app.use("/api/tracks", authenticateUser, tracks);
app.use("/api/constructors", authenticateUser, teams);
app.use("/api/drivers", authenticateUser, drivers);
app.use("/api/profiles", authenticateUser, profiles);
app.use("/auth", auth);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.use("/app", (req: Request, res: Response) => {
  const indexHtml = path.resolve(staticDir, "index.html");
  fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
    res.send(html)
  );
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
