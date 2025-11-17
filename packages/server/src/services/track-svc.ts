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

export default { index, get };
