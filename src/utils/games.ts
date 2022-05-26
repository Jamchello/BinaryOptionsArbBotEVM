import { betData, BetDirection, gameData, GamesDictionary } from "../types";
import {
  dogeFilter,
  prdtFilter,
  pancakeSwapFilter,
  candleGenieFilter,
} from "./constants";
import doge from "./contracts/doge";
import pancake from "./contracts/pancakeSwap";
import prdtProxyContractInstance from "./contracts/prdtProxy";
import genie from "./contracts/candleGenie";
import wallet from "./wallet";
import { parseEther } from "ethers/lib/utils";
const dogeContractInstance = doge(wallet);
const pcksContractInstance = pancake(wallet);
const candleGenieContractInstance = genie(wallet);

const gamesDictionary: GamesDictionary = {
  Doge: {
    site: "Doge",
    filter: dogeFilter,
    bullIndex: 1,
    bearIndex: 2,
    fetchGameInfo: async (game: gameData) =>
      dogeContractInstance.Rounds(game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const betFunc =
        side == BetDirection.BEAR
          ? dogeContractInstance.betBear
          : dogeContractInstance.betBull;
      const tx = await betFunc(parseEther(amount), activeEpoch, {
        gasPrice,
        nonce,
      });
      await tx.wait(3);
      return true;
    },
  },
  // PRDT: {
  //   site: "PRDT",
  //   filter: prdtFilter,
  //   bullIndex: 2,
  //   bearIndex: 3,
  //   fetchGameInfo: async (game: gameData) =>
  //     prdtProxyContractInstance.getRound(0, game.activeEpoch),
  //   makeBet: async (game: betData) => {
  //     const betFunc = game.side == BetDirection.BEAR ? dogeContractInstance.user_BetBear : dogeContractInstance.user_BetBull;
  //     const tx = await betFunc(parseEther(game.amount.toString()), game.activeEpoch)
  //     await tx.wait(3)
  //     return true
  //   }
  // },
  PancakeSwap: {
    site: "PancakeSwap",
    filter: pancakeSwapFilter,
    bullIndex: 9,
    bearIndex: 10,
    fetchGameInfo: async (game: gameData) =>
      pcksContractInstance.rounds(game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const betFunc =
        side == BetDirection.BEAR
          ? pcksContractInstance.user_BetBear
          : pcksContractInstance.user_BetBull;
      const tx = await betFunc(parseEther(amount), activeEpoch, {
        gasPrice,
        nonce,
      });
      await tx.wait(3);
      return true;
    },
  },
  Genie: {
    site: "Genie",
    filter: candleGenieFilter,
    bullIndex: 1,
    bearIndex: 2,
    fetchGameInfo: async (game: gameData) =>
      candleGenieContractInstance.Rounds(game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const betFunc =
        side == BetDirection.BEAR
          ? pcksContractInstance.BetBear
          : pcksContractInstance.BetBull;
      const tx = await betFunc(parseEther(amount), activeEpoch, {
        gasPrice,
        nonce,
      });
      await tx.wait(3);
      return true;
    },
  },
};

export default gamesDictionary;
