import { Auth, define, History, Switch } from "@calpoly/mustang";
import { html } from "lit";
import { HeaderElement } from "./components/header";
import { CardElement } from "./components/card";
import { DeckElement } from "./components/deck";
import { FavoritesElement } from "./components/favorites";
import { DriverElement } from "./components/driver";
import { TeamElement } from "./components/team";
import { TrackElement } from "./components/track";
import { LoginElement } from "./components/login";

// Driver label to number mapping
const driverMap: Record<string, number> = {
  "A Albon": 23,
  "A Alonso": 14,
  "K Antonelli": 12,
  "O Bearman": 50,
  "G Bortoleto": 5,
  "F Colapinto": 43,
  "P Gasly": 10,
  "I Hadjar": 39,
  "L Hamilton": 44,
  "N Hulkenberg": 27,
  "L Lawson": 30,
  "C Leclerc": 16,
  "L Norris": 4,
  "E Ocon": 31,
  "O Piastri": 81,
  "G Russel": 63,
  "C Sainz": 55,
  "L Stroll": 18,
  "Y Tsunoda": 22,
  "M Verstappen": 1,
};

const routes = [
  {
    path: "/app/login",
    view: () => html`<login-element></login-element>`,
  },
  {
    path: "/app/schedule",
    view: () => html`
      <header-element name="Schedule"></header-element>
      <deck-element src="/api/cards/category/schedule"></deck-element>
    `,
  },
  {
    path: "/app/constructors",
    view: () => html`
      <header-element name="Constructors"></header-element>
      <deck-element src="/api/cards/category/constructors"></deck-element>
    `,
  },
  {
    path: "/app/drivers",
    view: () => html`
      <header-element name="Drivers"></header-element>
      <deck-element src="/api/cards/category/drivers"></deck-element>
    `,
  },
  {
    path: "/app/favorites",
    view: () => html`
      <header-element name="Favorites"></header-element>
      <favorites-element></favorites-element>
    `,
  },
  {
    path: "/app/schedule/:label",
    view: (params: Switch.Params, query?: URLSearchParams) => html`
      <header-element name="${params.label}" identifier="${query?.get("cardId")}"></header-element>
      <track-element src="/api/tracks/${params.label}"></track-element>
    `,
  },
  {
    path: "/app/constructors/:label",
    view: (params: Switch.Params, query?: URLSearchParams) => html`
      <header-element name="${params.label}" identifier="${query?.get("cardId")}"></header-element>
      <team-element src="/api/constructors/${params.label}"></team-element>
    `,
  },
  {
    path: "/app/drivers/:label",
    view: (params: Switch.Params, query?: URLSearchParams) => html`
      <header-element name="${params.label}" identifier="${query?.get("cardId")}"></header-element>
      <driver-element src="/api/drivers/${driverMap[params.label]}"></driver-element>
    `,
  },
  {
    path: "/app",
    view: () => html`
        <header-element name="Luminance"></header-element>
        <deck-element src="/api/cards/category/mainPages"></deck-element>`,
  },
  {
    path: "/",
    redirect: "/app",
  },
];

define({
  "mu-auth": Auth.Provider,
  "mu-history": History.Provider,
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes, "lum:history", "lum:auth");
    }
  },
  "card-element": CardElement,
  "deck-element": DeckElement,
  "driver-element": DriverElement,
  "favorites-element": FavoritesElement,
  "header-element": HeaderElement,
  "login-element": LoginElement,
  "team-element": TeamElement,
  "track-element": TrackElement,
});
