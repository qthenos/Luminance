// src/routes/tracks.ts
import express, { Request, Response } from "express";
import { Track } from "../models/track";

import Tracks from "../services/track-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Tracks.index()
    .then((list: Track[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:trackName", (req: Request, res: Response) => {
  const { trackName } = req.params;

  Tracks.get(trackName)
    .then((track: Track) => res.json(track))
    .catch((err) => res.status(404).send(err));
});

router.put("/:trackName", (req: Request, res: Response) => {
  const { trackName } = req.params;
  const newTrack = req.body;

  Tracks.update(trackName, newTrack)
    .then((track: Track) => res.json(track))
    .catch((err) => res.status(404).end());
});

export default router;
