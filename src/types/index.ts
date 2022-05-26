import { BigNumber, providers, Wallet } from "ethers";

interface PdrResultItem {
  address: string;
}
export enum BetDirection {
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
}

export interface gameDataWithValues extends gameData {
  total: number;
  bear: number;
  bull: number;
}

export interface betData {
  side: BetDirection;
  amount: string;
  gasPrice: BigNumber;
  nonce: number;
  activeEpoch: number;
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
  fetchGameInfo: (game: gameData) => Promise<Array<number>>;
  makeBet: (game: betData) => Promise<boolean>;
}

export interface GamesDictionary {
  [key: string]: GameDictionaryItem;
}
