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
var team_svc_exports = {};
__export(team_svc_exports, {
  default: () => team_svc_default
});
module.exports = __toCommonJS(team_svc_exports);
var import_mongoose = require("mongoose");
const TeamSchema = new import_mongoose.Schema(
  {
    teamName: { type: String, required: true },
    imageSrc: { type: String, required: true },
    ranking: {
      wccPosition: { type: Number, required: true },
      currentPoints: { type: Number, required: true }
    },
    drivers: [
      {
        name: { type: String, required: true },
        carNumber: { type: Number, required: true },
        joinedTeam: { type: Number, required: true }
      }
    ]
  },
  { collection: "lum-teams" }
);
const TeamModel = (0, import_mongoose.model)("Team", TeamSchema);
function index() {
  return TeamModel.find();
}
function get(teamName) {
  return TeamModel.find({ teamName }).then((list) => list[0]).catch((err) => {
    throw `${teamName} Not Found`;
  });
}
function update(teamName, team) {
  const updateOps = {};
  Object.entries(team).forEach(([key, value]) => {
    if (typeof value === "object" && value !== null) {
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        updateOps[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      updateOps[key] = value;
    }
  });
  return TeamModel.findOneAndUpdate({ teamName }, { $set: updateOps }, {
    new: true
  }).then((updated) => {
    if (!updated) {
      console.error(`Team ${teamName} not found for update`);
      throw `${teamName} not updated`;
    } else return updated;
  }).catch((err) => {
    console.error(`Update error for team ${teamName}:`, err);
    throw err;
  });
}
var team_svc_default = { index, get, update };
