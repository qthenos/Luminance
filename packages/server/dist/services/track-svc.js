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
var track_svc_exports = {};
__export(track_svc_exports, {
  default: () => track_svc_default
});
module.exports = __toCommonJS(track_svc_exports);
var import_mongoose = require("mongoose");
const TrackSchema = new import_mongoose.Schema(
  {
    trackName: { type: String, required: true },
    cityName: { type: String, required: true },
    drsZones: { type: Number, required: true },
    turns: { type: Number, required: true },
    tireCompounds: { type: [String], required: true },
    firstGP: { type: Number, required: true },
    circuitLen: { type: String, required: true },
    numLaps: { type: Number, required: true },
    raceDistance: { type: String, required: true },
    lapRecord: {
      time: { type: String, required: true },
      driver: { type: String, required: true },
      year: { type: Number, required: true }
    },
    figure: {
      src: { type: String, required: true },
      caption: { type: String, required: true }
    }
  },
  { collection: "lum-tracks" }
);
const TrackModel = (0, import_mongoose.model)("Track", TrackSchema);
function index() {
  return TrackModel.find();
}
function get(trackName) {
  return TrackModel.find({ trackName }).then((list) => list[0]).catch((err) => {
    throw `${trackName} Not Found`;
  });
}
function update(trackName, track) {
  const updateOps = {};
  Object.entries(track).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        updateOps[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      updateOps[key] = value;
    }
  });
  return TrackModel.findOneAndUpdate({ trackName }, { $set: updateOps }, {
    new: true
  }).then((updated) => {
    if (!updated) {
      console.error(`Track ${trackName} not found for update`);
      throw `${trackName} not updated`;
    } else return updated;
  }).catch((err) => {
    console.error(`Update error for track ${trackName}:`, err);
    throw err;
  });
}
var track_svc_default = { index, get, update };
