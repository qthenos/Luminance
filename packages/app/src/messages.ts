// app/src/messages.ts
import type { Card, Driver, Team, Track } from "server/models";

export type Msg =
  | ["driver/request", { number: number }]
  | ["driver/response", Driver]
  | ["driver/update", { number: number; data: Driver }]
  | ["drivers/request", {}]
  | ["drivers/response", Card[]]
  | ["team/request", { teamName: string }]
  | ["team/response", Team]
  | ["team/update", { teamName: string; data: Team }]
  | ["teams/request", {}]
  | ["teams/response", Card[]]
  | ["track/request", { trackName: string }]
  | ["track/response", Track]
  | ["track/update", { trackName: string; data: Track }]
  | ["tracks/request", {}]
  | ["tracks/response", Card[]]
  | ["favorites/request", { userid: string }]
  | ["favorites/response", Card[]]