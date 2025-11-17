// src/routes/teams.ts
import express, { Request, Response } from "express";
import { Team } from "../models/team";

import Teams from "../services/team-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Teams.index()
    .then((list: Team[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:teamName", (req: Request, res: Response) => {
  const { teamName } = req.params;

  Teams.get(teamName)
    .then((team: Team) => res.json(team))
    .catch((err) => res.status(404).send(err));
});

export default router;
