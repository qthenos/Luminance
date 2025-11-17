// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import cards from "./routes/cards";
import tracks from "./routes/tracks";
import teams from "./routes/teams";
import drivers from "./routes/drivers";
import auth, { authenticateUser } from "./routes/auth";

connect("LuminarDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());

app.use("/api/cards", authenticateUser, cards);
app.use("/api/tracks", authenticateUser, tracks);
app.use("/api/teams", authenticateUser, teams);
app.use("/api/drivers", authenticateUser, drivers);
app.use("/auth", auth);

app.get("/hello", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
