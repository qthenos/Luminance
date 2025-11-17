export interface Driver {
  name: string;
  number: number;
  team: string;
  imageSrc: string;
  bio: string;
  standings: {
    points: number;
    position: string;
  };
  stats: {
    grandPrixEntered: number;
    careerPoints: number;
    highestRaceFinish: string;
    podiums: number;
    highestGridPosition: string;
    polePositions: number;
    worldChampionships: number;
    dnfs: number;
  };
}
