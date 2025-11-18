// src/routes/profiles.ts
import express, { Request, Response } from "express";
import { Profile } from "../models/profile";
import { Card } from "../models/card";

import Profiles from "../services/profile-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Profiles.index()
    .then((list: Profile[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:userID", (req: Request, res: Response) => {
  const { userID } = req.params;

  Profiles.get(userID)
    .then((card: Profile) => res.json(card))
    .catch((err) => res.status(404).send(err));
});

router.put("/:userID", (req: Request, res: Response) => {
  const { userID } = req.params;
  const newProfile = req.body;

  Profiles.update(userID, newProfile)
    .then((card: Profile) => res.json(card))
    .catch((err) => res.status(404).end());
});

router.get("/:userID/favorites", (req: Request, res: Response) => {
  const { userID } = req.params;

  Profiles.getFavorites(userID)
    .then((cards: Card[]) => res.json(cards))
    .catch((err) => res.status(404).send(err));
});

router.post("/:userID/favorites/:cardID", (req: Request, res: Response) => {
  const { userID, cardID } = req.params;

  Profiles.addFavorite(userID, cardID)
    .then((profile: Profile) => res.json(profile))
    .catch((err) => res.status(404).send(err));
});

router.delete("/:userID/favorites/:cardID", (req: Request, res: Response) => {
  const { userID, cardID } = req.params;

  Profiles.removeFavorite(userID, cardID)
    .then((profile: Profile) => res.json(profile))
    .catch((err) => res.status(404).send(err));
});

export default router;
