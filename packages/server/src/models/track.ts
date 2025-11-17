export interface Track {
  trackName: string;
  cityName: string;
  drsZones: number;
  turns: number;
  tireCompounds: string[];
  firstGP: number;
  circuitLen: string;
  numLaps: number;
  raceDistance: string;
  lapRecord: {
    time: string;
    driver: string;
    year: number;
  };
  figure: {
    src: string;
    caption: string;
  };
}
