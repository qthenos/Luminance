// src/services/card-svc.ts
import { Schema, model } from "mongoose";
import { Card } from "../models/card";

const CardSchema = new Schema<Card>(
  {
    link: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    img: { type: String, trim: true },
    backImg: { type: String, trim: true }
  },
  { collection: "lum-cards" }
);

const CardModel = model<Card>(
  "Card",
  CardSchema
);

function index(): Promise<Card[]> {
  return CardModel.find();
}

function get(label: String): Promise<Card> {
  return CardModel.find({ label })
    .then((list) => list[0])
    .catch((err) => {
      throw `${label} Not Found`;
    });
}

export default { index, get };