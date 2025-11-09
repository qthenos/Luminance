// src/routes/cards.ts
import express, { Request, Response } from "express";
import { Card } from "../models/card";

import Cards from "../services/card-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Cards.index()
    .then((list: Card[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:label", (req: Request, res: Response) => {
  const { label } = req.params;

  Cards.get(label)
    .then((card: Card) => res.json(card))
    .catch((err) => res.status(404).send(err));
});

router.post("/", (req: Request, res: Response) => {
  const newCard = req.body;

  Cards.create(newCard)
    .then((card: Card) =>
      res.status(201).json(card)
    )
    .catch((err) => res.status(500).send(err));
});

router.put("/:label", (req: Request, res: Response) => {
  const { label } = req.params;
  const newCard = req.body;

  Cards.update(label, newCard)
    .then((card: Card) => res.json(card))
    .catch((err) => res.status(404).end());
});

router.delete("/:label", (req: Request, res: Response) => {
  const { label } = req.params;

  Cards.remove(label)
    .then(() => res.status(204).end())
    .catch((err) => res.status(404).send(err));
});

export default router;