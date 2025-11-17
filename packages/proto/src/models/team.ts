export interface Team {
  teamName: string;
  imageSrc: string;
  ranking: {
    wccPosition: number;
    currentPoints: number;
  };
  drivers: {
    name: string;
    carNumber: number;
    joinedTeam: number;
  }[];
}
