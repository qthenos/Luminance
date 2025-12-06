// app/src/model.ts
import { Card, Driver, Team, Track } from "server/models";

export interface Model {
  card?: Card;
  driver?: Driver;
  drivers?: Card[];
  team?: Team;
  teams?: Card[];
  track?: Track;
  tracks?: Card[];
  favorites?: Card[];
}

export const init: Model = {};