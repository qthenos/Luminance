"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var card_svc_exports = {};
__export(card_svc_exports, {
  default: () => card_svc_default
});
module.exports = __toCommonJS(card_svc_exports);
var import_mongoose = require("mongoose");
const CardSchema = new import_mongoose.Schema(
  {
    link: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
    img: { type: String, trim: true },
    backImg: { type: String, trim: true }
  },
  { collection: "lum-cards" }
);
const CardModel = (0, import_mongoose.model)(
  "Card",
  CardSchema
);
function index() {
  return CardModel.find();
}
function get(label) {
  return CardModel.find({ label }).then((list) => list[0]).catch((err) => {
    throw `${label} Not Found`;
  });
}
var card_svc_default = { index, get };
