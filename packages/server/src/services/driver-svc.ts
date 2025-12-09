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
      team: { type: String, required: true },
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

function update(number: number, driver: Driver): Promise<Driver> {
  // Use $set to update individual fields to avoid conflicts
  const updateOps: Record<string, any> = {};
  
  Object.entries(driver).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // For nested objects, use dot notation
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        updateOps[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      updateOps[key] = value;
    }
  });
  
  return DriverModel.findOneAndUpdate({ number }, { $set: updateOps }, {
    new: true,
  }).then((updated) => {
    if (!updated) {
      console.error(`Driver ${number} not found for update`);
      throw `${number} not updated`;
    }
    else return updated as Driver;
  }).catch((err) => {
    console.error(`Update error for driver ${number}:`, err);
    throw err;
  });
}

export default { index, get, update };
