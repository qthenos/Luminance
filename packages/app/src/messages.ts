// app/src/messages.ts
import type { Card, Driver, Team, Track } from "server/models";

export type Msg =
  | ["driver/request", { number: number }]
  | ["driver/response", Driver]
  | ["drivers/request", {}]
  | ["drivers/response", Card[]]
  | ["team/request", { teamName: string }]
  | ["team/response", Team]
  | ["teams/request", {}]
  | ["teams/response", Card[]]
  | ["track/request", { trackName: string }]
  | ["track/response", Track]
  | ["tracks/request", {}]
  | ["tracks/response", Card[]]
  | ["favorites/request", { userid: string }]
  | ["favorites/response", Card[]]