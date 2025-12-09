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
var driver_svc_exports = {};
__export(driver_svc_exports, {
  default: () => driver_svc_default
});
module.exports = __toCommonJS(driver_svc_exports);
var import_mongoose = require("mongoose");
const DriverSchema = new import_mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true },
    team: { type: String, required: true },
    imageSrc: { type: String, required: true },
    bio: { type: String, required: true },
    standings: {
      team: { type: String, required: true },
      points: { type: Number, required: true },
      position: { type: String, required: true }
    },
    stats: {
      grandPrixEntered: { type: Number, required: true },
      careerPoints: { type: Number, required: true },
      highestRaceFinish: { type: String, required: true },
      podiums: { type: Number, required: true },
      highestGridPosition: { type: String, required: true },
      polePositions: { type: Number, required: true },
      worldChampionships: { type: Number, required: true },
      dnfs: { type: Number, required: true }
    }
  },
  { collection: "lum-drivers" }
);
const DriverModel = (0, import_mongoose.model)("Driver", DriverSchema);
function index() {
  return DriverModel.find();
}
function get(number) {
  return DriverModel.find({ number }).then((list) => list[0]).catch((err) => {
    throw `${number} Not Found`;
  });
}
function update(number, driver) {
  const updateOps = {};
  Object.entries(driver).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        updateOps[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      updateOps[key] = value;
    }
  });
  return DriverModel.findOneAndUpdate({ number }, { $set: updateOps }, {
    new: true
  }).then((updated) => {
    if (!updated) {
      console.error(`Driver ${number} not found for update`);
      throw `${number} not updated`;
    } else return updated;
  }).catch((err) => {
    console.error(`Update error for driver ${number}:`, err);
    throw err;
  });
}
var driver_svc_default = { index, get, update };
