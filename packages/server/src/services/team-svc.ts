// src/services/team-svc.ts
import { Schema, model } from "mongoose";
import { Team } from "../models/team";

const TeamSchema = new Schema<Team>(
  {
    teamName: { type: String, required: true },
    imageSrc: { type: String, required: true },
    ranking: {
      wccPosition: { type: Number, required: true },
      currentPoints: { type: Number, required: true },
    },
    drivers: [
      {
        name: { type: String, required: true },
        carNumber: { type: Number, required: true },
        joinedTeam: { type: Number, required: true },
      },
    ],
  },
  { collection: "lum-teams" },
);

const TeamModel = model<Team>("Team", TeamSchema);

function index(): Promise<Team[]> {
  return TeamModel.find();
}

function get(teamName: String): Promise<Team> {
  return TeamModel.find({ teamName })
    .then((list) => list[0])
    .catch((err) => {
      throw `${teamName} Not Found`;
    });
}

export default { index, get };
