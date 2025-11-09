// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Cards from "./services/card-svc";

connect("LuminarDB");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.get("/cards/:label", (req: Request, res: Response) => {
  const { label } = req.params;

  Cards.get(label).then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});

app.get("/cards", (req: Request, res: Response) => {
  Cards.index().then((data) => {
    if (data) res
      .set("Content-Type", "application/json")
      .send(JSON.stringify(data));
    else res
      .status(404).send();
  });
});