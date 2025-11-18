import {Card} from "./card";

export interface Profile {
  userid: string;
  favoriteCards: Card[];
  avatar: string | undefined;
}