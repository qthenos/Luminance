// app/src/update.ts
import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";
import type { Card, Driver, Team, Track } from "server/models";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
): Model | ThenUpdate<Model, Msg> {
  const [command, payload] = message;

  switch (command) {
    // Driver cases
    case "driver/request": {
      return [
        model,
        requestDriver(payload, user)
          .then((driver) => ["driver/response", driver])
      ];
    }
    case "driver/response": {
      return { ...model, driver: payload };
    }

    case "drivers/request": {
      return [
        model,
        requestDrivers(user)
          .then((cards) => ["drivers/response", cards])
      ];
    }
    case "drivers/response": {
      return { ...model, drivers: payload };
    }

    // Team cases
    case "team/request": {
      return [
        model,
        requestTeam(payload, user)
          .then((team) => ["team/response", team])
      ];
    }
    case "team/response": {
      return { ...model, team: payload };
    }

    case "teams/request": {
      return [
        model,
        requestTeams(user)
          .then((cards) => ["teams/response", cards])
      ];
    }
    case "teams/response": {
      return { ...model, teams: payload };
    }

    // Track cases
    case "track/request": {
      return [
        model,
        requestTrack(payload, user)
          .then((track) => ["track/response", track])
      ];
    }
    case "track/response": {
      return { ...model, track: payload };
    }

    case "tracks/request": {
      return [
        model,
        requestTracks(user)
          .then((cards) => ["tracks/response", cards])
      ];
    }
    case "tracks/response": {
      return { ...model, tracks: payload };
    }

    // Favorites cases
    case "favorites/request": {
      return [
        model,
        requestFavorites(payload, user)
          .then((cards) => ["favorites/response", cards])
      ];
    }
    case "favorites/response": {
      return { ...model, favorites: payload };
    }

    default:
      const unhandled: never = command;
      throw new Error(`Unhandled message "${unhandled}"`);
  }

  return model;
}

function requestDriver(
  msg: { number: number },
  user?: Auth.User
): Promise<Driver> {
  return fetch(`/api/drivers/${msg.number}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        return json as Driver;
      } else
        throw "No JSON in response body";
    });
}

function requestDrivers(user?: Auth.User): Promise<Card[]> {
  return fetch(`/api/cards/category/drivers`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return [];
    })
    .then((json: unknown) => {
      if (json) {
        return json as Card[];
      } else
        return [];
    });
}

function requestTeam(
  msg: { teamName: string },
  user?: Auth.User
): Promise<Team> {
  return fetch(`/api/constructors/${msg.teamName}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        return json as Team;
      } else
        throw "No JSON in response body";
    });
}

function requestTeams(user?: Auth.User): Promise<Card[]> {
  return fetch(`/api/cards/category/constructors`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return [];
    })
    .then((json: unknown) => {
      if (json) {
        return json as Card[];
      } else
        return [];
    });
}

function requestTrack(
  msg: { trackName: string },
  user?: Auth.User
): Promise<Track> {
  return fetch(`/api/tracks/${msg.trackName}`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return undefined;
    })
    .then((json: unknown) => {
      if (json) {
        return json as Track;
      } else
        throw "No JSON in response body";
    });
}

function requestTracks(user?: Auth.User): Promise<Card[]> {
  return fetch(`/api/cards/category/schedule`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return [];
    })
    .then((json: unknown) => {
      if (json) {
        return json as Card[];
      } else
        return [];
    });
}

function requestFavorites(
  msg: { userid: string },
  user?: Auth.User
): Promise<Card[]> {
  return fetch(`/api/profiles/${msg.userid}/favorites`, {
    headers: Auth.headers(user)
  })
    .then((response: Response) => {
      if (response.status === 200) {
        return response.json();
      }
      return [];
    })
    .then((json: unknown) => {
      if (json) {
        return json as Card[];
      } else
        return [];
    });
}