// src/services/track-svc.ts
import { Schema, model } from "mongoose";
import { Track } from "../models/track";

const TrackSchema = new Schema<Track>(
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
      year: { type: Number, required: true },
    },
    figure: {
      src: { type: String, required: true },
      caption: { type: String, required: true },
    },
  },
  { collection: "lum-tracks" },
);

const TrackModel = model<Track>("Track", TrackSchema);

function index(): Promise<Track[]> {
  return TrackModel.find();
}

function get(trackName: String): Promise<Track> {
  return TrackModel.find({ trackName })
    .then((list) => list[0])
    .catch((err) => {
      throw `${trackName} Not Found`;
    });
}

function update(trackName: String, track: Track): Promise<Track> {
  // Use $set to update individual fields to avoid conflicts
  const updateOps: Record<string, any> = {};
  
  Object.entries(track).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // For nested objects, use dot notation
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        updateOps[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      updateOps[key] = value;
    }
  });
  
  return TrackModel.findOneAndUpdate({ trackName }, { $set: updateOps }, {
    new: true,
  }).then((updated) => {
    if (!updated) {
      console.error(`Track ${trackName} not found for update`);
      throw `${trackName} not updated`;
    }
    else return updated as Track;
  }).catch((err) => {
    console.error(`Update error for track ${trackName}:`, err);
    throw err;
  });
}

export default { index, get, update };
