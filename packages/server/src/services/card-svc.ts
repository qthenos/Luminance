// src/services/card-svc.ts
import { Schema, model } from "mongoose";
import { Card } from "../models/card";

const CardSchema = new Schema<Card>(
  {
    link: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    img: { type: String, trim: true },
    backImg: { type: String, trim: true },
    category: { type: String, trim: true },
  },
  { collection: "lum-cards" },
);

const CardModel = model<Card>("Card", CardSchema);

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

function getByCategory(category: String): Promise<Card[]> {
  return CardModel.find({ category }).catch((err) => {
    throw `${category} Not Found`;
  });
}

function create(json: Card): Promise<Card> {
  const c = new CardModel(json);
  return c.save();
}

function update(label: String, card: Card): Promise<Card> {
  return CardModel.findOneAndUpdate({ label }, card, {
    new: true,
  }).then((updated) => {
    if (!updated) throw `${label} not updated`;
    else return updated as Card;
  });
}

function remove(label: String): Promise<void> {
  return CardModel.findOneAndDelete({ label }).then((deleted) => {
    if (!deleted) throw `${label} not deleted`;
  });
}

export default { index, get, getByCategory, create, update, remove };
