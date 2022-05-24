import { gameData, GamesDictionary } from "../types";
import {
  dogeFilter,
  prdtFilter,
  pancakeSwapFilter,
  candleGenieFilter,
} from "./constants";
import dogeContractInstance from "./contracts/doge";
import pcksContractInstance from "./contracts/pancakeSwap";
import prdtProxyContractInstance from "./contracts/prdtProxy";
import candleGenieContractInstance from "./contracts/candleGenie";

const gamesDictionary: GamesDictionary = {
  Doge: {
    site: "Doge",
    filter: dogeFilter,
    bullIndex: 1,
    bearIndex: 2,
    betsHandler: async (game: gameData) =>
      dogeContractInstance.Rounds(game.activeEpoch),
  },
  PRDT: {
    site: "PRDT",
    filter: prdtFilter,
    bullIndex: 2,
    bearIndex: 3,
    betsHandler: async (game: gameData) =>
      prdtProxyContractInstance.getRound(0, game.activeEpoch),
  },
  PancakeSwap: {
    site: "PancakeSwap",
    filter: pancakeSwapFilter,
    bullIndex: 9,
    bearIndex: 10,
    betsHandler: async (game: gameData) =>
      pcksContractInstance.rounds(game.activeEpoch),
  },
  Genie: {
    site: "Genie",
    filter: candleGenieFilter,
    bullIndex: 1,
    bearIndex: 2,
    betsHandler: async (game: gameData) =>
      candleGenieContractInstance.Rounds(game.activeEpoch),
  },
};

export default gamesDictionary;
