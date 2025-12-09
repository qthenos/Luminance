// src/routes/drivers.ts
import express, { Request, Response } from "express";
import { Driver } from "../models/driver";

import Drivers from "../services/driver-svc";

const router = express.Router();

router.get("/", (_, res: Response) => {
  Drivers.index()
    .then((list: Driver[]) => res.json(list))
    .catch((err) => res.status(500).send(err));
});

router.get("/:number", (req: Request<{ number: string }>, res: Response) => {
  const { number } = req.params;
  const driverNumber = Number(number);
  if (Number.isNaN(driverNumber)) {
    return res.status(400).send("Bad request: number must be numeric.");
  }

  Drivers.get(driverNumber)
    .then((driver: Driver) => res.json(driver))
    .catch((err) => res.status(404).send(err));
});

router.put("/:number", (req: Request<{ number: string }>, res: Response) => {
  const { number } = req.params;
  const driverNumber = Number(number);
  if (Number.isNaN(driverNumber)) {
    return res.status(400).send("Bad request: number must be numeric.");
  }
  const newDriver = req.body;

  Drivers.update(driverNumber, newDriver)
    .then((driver: Driver) => res.json(driver))
    .catch((err) => {
      console.error("Update error:", err);
      res.status(404).json({ error: err });
    });
});

export default router;
