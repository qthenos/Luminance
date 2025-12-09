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

function update(teamName: String, team: Team): Promise<Team> {
  // Use $set to update individual fields to avoid conflicts
  const updateOps: Record<string, any> = {};
  
  Object.entries(team).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // For nested objects, use dot notation
      Object.entries(value).forEach(([nestedKey, nestedValue]) => {
        updateOps[`${key}.${nestedKey}`] = nestedValue;
      });
    } else {
      updateOps[key] = value;
    }
  });
  
  return TeamModel.findOneAndUpdate({ teamName }, { $set: updateOps }, {
    new: true,
  }).then((updated) => {
    if (!updated) {
      console.error(`Team ${teamName} not found for update`);
      throw `${teamName} not updated`;
    }
    else return updated as Team;
  }).catch((err) => {
    console.error(`Update error for team ${teamName}:`, err);
    throw err;
  });
}

export default { index, get, update };
