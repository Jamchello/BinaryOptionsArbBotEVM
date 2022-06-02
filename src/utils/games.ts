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

const Doge_gasLimit = 175_000 ;
const PRDT_gasLimit = 130_000 ; 
const PancakeSwap_gasLimit = 130_000 ; 
const candleGenie_gasLimit = 175_000 ; 



const gamesDictionary: GamesDictionary = {
  Doge: {
    site: "Doge",
    filter: dogeFilter,
    bullIndex: 1,
    bearIndex: 2,
    gasLimit: Doge_gasLimit,
    fetchGameInfo: async (game: gameData) =>
      dogeContractInstance.Rounds(game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const options = {        
        gasPrice,
        gasLimit: Doge_gasLimit,
        nonce,
        value: parseEther(amount),}
        
      const tx =
        side == BetDirection.BEAR
          ? await dogeContractInstance.user_BetBear(activeEpoch,options)
          : await dogeContractInstance.user_BetBull(activeEpoch, options);
      await tx.wait(3);
      return true;
    },
  },
  PRDT: {
    site: "PRDT",
    filter: prdtFilter,
    bullIndex: 2,
    bearIndex: 3,
    gasLimit: PRDT_gasLimit,
    fetchGameInfo: async (game: gameData) =>
      prdtProxyInstance.getRound(0, game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const options = {        
        gasPrice,
        gasLimit: PRDT_gasLimit,
        nonce,
        value: parseEther(amount),}
        
      const tx =
        side == BetDirection.BEAR
          ? await prdtContractInstance.betBear(activeEpoch,options)
          : await prdtContractInstance.betBull(activeEpoch, options);
      await tx.wait(3);
      return true;
    },
  },
  PancakeSwap: {
    site: "PancakeSwap",
    filter: pancakeSwapFilter,
    bullIndex: 9,
    bearIndex: 10,
    gasLimit: PancakeSwap_gasLimit,
    fetchGameInfo: async (game: gameData) =>
      pcksContractInstance.rounds(game.activeEpoch),
    makeBet: async (game: betData) => {
      const { amount, side, activeEpoch, gasPrice, nonce } = game;
      const options = {        
        gasPrice,
        gasLimit: PancakeSwap_gasLimit,
        nonce,
        value: parseEther(amount),}
        
      const tx =
        side == BetDirection.BEAR
          ? await pcksContractInstance.betBear(activeEpoch,options)
          : await pcksContractInstance.betBull(activeEpoch, options);

      await tx.wait(3);
      return true;
    },
  },

};

/*const  Genie: {
  site: "Genie",
  filter: candleGenieFilter,
  bullIndex: 1,
  bearIndex: 2,
  gasLimit: candleGenie_gasLimit,
  fetchGameInfo: async (game: gameData) =>
    candleGenieContractInstance.Rounds(game.activeEpoch),
  makeBet: async (game: betData) => {
    const { amount, side, activeEpoch, gasPrice, nonce } = game;
    const options = {        
      gasPrice,
      gasLimit: candleGenie_gasLimit,
      nonce,
      value: parseEther(amount),}
      
    const tx =
      side == BetDirection.BEAR
        ? await candleGenieContractInstance.BetBear(activeEpoch,options)
        : await candleGenieContractInstance.BetBull(activeEpoch, options);
    await tx.wait(3);
    return true;
  },
},*/

export default gamesDictionary;
