// src/services/driver-svc.ts
import { Schema, model } from "mongoose";
import { Driver } from "../models/driver";

const DriverSchema = new Schema<Driver>(
  {
    name: { type: String, required: true },
    number: { type: Number, required: true },
    team: { type: String, required: true },
    imageSrc: { type: String, required: true },
    bio: { type: String, required: true },
    standings: {
      points: { type: Number, required: true },
      position: { type: String, required: true },
    },
    stats: {
      grandPrixEntered: { type: Number, required: true },
      careerPoints: { type: Number, required: true },
      highestRaceFinish: { type: String, required: true },
      podiums: { type: Number, required: true },
      highestGridPosition: { type: String, required: true },
      polePositions: { type: Number, required: true },
      worldChampionships: { type: Number, required: true },
      dnfs: { type: Number, required: true },
    },
  },
  { collection: "lum-drivers" },
);

const DriverModel = model<Driver>("Driver", DriverSchema);

function index(): Promise<Driver[]> {
  return DriverModel.find();
}

function get(number: number): Promise<Driver> {
  return DriverModel.find({ number })
    .then((list) => list[0])
    .catch((err) => {
      throw `${number} Not Found`;
    });
}

export default { index, get };
