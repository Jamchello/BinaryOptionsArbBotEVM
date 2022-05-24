import { providers } from "ethers";

interface PdrResultItem {
  address: string;
}
export enum betDirection {
  BULL = 1,
  BEAR = 0,
}

export interface PdrData {
  result: Array<PdrResultItem>;
}



export type KeepAliveParams = {
  provider: providers.WebSocketProvider;
  onDisconnect: (err: any) => void;
  expectedPongBack?: number;
  checkInterval?: number;
};

export interface logEvent {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;
  removed: boolean;
  address: string;
  data: string;
  topics: [string, string];
  transactionHash: string;
  logIndex: number;
}

export interface gameData {
  site: Site;
  activeEpoch: number;
  timeStarted: number;
  multiplierBull?: number;
  multiplierBear?: number;
  betDirection?: betDirection
}

export type Site = "PRDT" | "PancakeSwap" | "Doge" | "Genie";

export type Rounds = Array<{ type: string; hex: string } | boolean>;

export type Games = [gameData, gameData];

export type Filter = {
  address: string;
  topics: Array<string>;
};

interface GameDictionaryItem {
  site: Site;
  filter: Filter;
  bullIndex: number;
  bearIndex: number;
  betsHandler: (game: gameData) => Promise<Array<number>>;
}

export interface GamesDictionary {
  [key: string]: GameDictionaryItem;
}
