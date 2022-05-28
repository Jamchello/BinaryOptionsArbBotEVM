import { betData, BetDirection, gameData, GamesDictionary } from "../types";
import {
  dogeFilter,
  prdtFilter,
  pancakeSwapFilter,
  candleGenieFilter,
} from "./constants";
import doge from "./contracts/doge";
import pancake from "./contracts/pancakeSwap";
import prdt from "./contracts/prdtProxy";
import genie from "./contracts/candleGenie";
import wallet from "./wallet";
import { parseEther } from "ethers/lib/utils";
import prdtProxy from "./contracts/prdtProxy";
const dogeContractInstance = doge(wallet);
const pcksContractInstance = pancake(wallet);
const candleGenieContractInstance = genie(wallet);
const prdtContractInstance = prdt(wallet);
const prdtProxyInstance = prdtProxy();

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
          ? dogeContractInstance.functions.user_BetBear
          : dogeContractInstance.functions.user_BetBull;
      const tx = await betFunc(activeEpoch, {
        gasPrice,
        gasLimit: 175_000,
        nonce,
        value: parseEther(amount),
      });
      await tx.wait(3);
      return true;
    },
  },
  PRDT: {
    site: "PRDT",
    filter: prdtFilter,
    bullIndex: 2,
    bearIndex: 3,
    fetchGameInfo: async (game: gameData) =>
      prdtProxyInstance.getRound(0, game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const betFunc =
        side == BetDirection.BEAR
          ? prdtContractInstance.betBear
          : prdtContractInstance.betBull;
      const tx = await betFunc(activeEpoch, {
        gasPrice,
        gasLimit: 130_000,
        nonce,
        value: parseEther(amount),
      });
      await tx.wait(3);
      return true;
    },
  },
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
          ? pcksContractInstance.betBear
          : pcksContractInstance.betBull;
      const tx = await betFunc(activeEpoch, {
        gasPrice,
        gasLimit: 130_000,
        nonce,
        value: parseEther(amount),
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
      const tx = await betFunc(activeEpoch, {
        gasPrice,
        gasLimit: 175_000,
        nonce,
        value: parseEther(amount),
      });
      await tx.wait(3);
      return true;
    },
  },
};

export default gamesDictionary;
