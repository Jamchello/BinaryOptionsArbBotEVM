import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { gameData, Rounds } from "../types";
import {
  candleGenieInstance,
  dogeBetsInstance,
  pancakeSwapInstance,
  predInstance,
} from "./constants";

const parsePancakeBets = (roundsData: Rounds) => {
  const bull = parseFloat(formatEther(roundsData[9].toString()));
  const bear = parseFloat(formatEther(roundsData[10].toString()));
  const total = bear + bull;

  console.log(`Pancake swap totals: Bull=${bull}, Bear=${bear}`);

  return [total, bear, bull];
};

const parseDogeBets = (roundsData: Rounds) => {
  const bull = parseFloat(formatEther(roundsData[1].toString()));
  const bear = parseFloat(formatEther(roundsData[2].toString()));
  const total = bear + bull;

  console.log(`DogeBets totals: Bull=${bull}, Bear=${bear}`);

  return [total, bear, bull];
};

const parsePredBets = (roundsData: Rounds) => {
  const bull = parseFloat(formatEther(roundsData[2].toString()));
  const bear = parseFloat(formatEther(roundsData[3].toString()));
  const total = bear + bull;
  console.log(`Pred totals: Bull=${bull}, Bear=${bear}`);
  return [total, bear, bull];
};

const parseGenieBets = (roundsData: Rounds) => {
  const bull = parseFloat(formatEther(roundsData[1].toString()));
  const bear = parseFloat(formatEther(roundsData[2].toString()));
  const total = bear + bull;
  console.log(`Genie totals: Bull=${bull}, Bear=${bear}`);
  return [total, bear, bull];
};

const prdtBetsHandler = async (game: gameData) => {
  const data = await predInstance.getRound(0, game.activeEpoch);
  return parsePredBets(data);
};

const pancakeBetsHandler = async (game: gameData) => {
  const data = await pancakeSwapInstance.rounds(game.activeEpoch);
  return parsePancakeBets(data);
};

const dogeBetsHandler = async (game: gameData) => {
  const data = await dogeBetsInstance.Rounds(game.activeEpoch);
  return parseDogeBets(data);
};

const genieBetsHandler = async (game: gameData) => {
  const data = await candleGenieInstance.Rounds(game.activeEpoch);
  return parseGenieBets(data);
};
//TODO: Single parseContractData function

//TODO put the handlers into the games list too.
const siteToBetsFunction: {
  [key: string]: (game: gameData) => Promise<Array<number>>;
} = {
  PRDT: prdtBetsHandler,
  PancakeSwap: pancakeBetsHandler,
  Doge: dogeBetsHandler,
  Genie: genieBetsHandler,
};

export const getBetsData = (game: gameData) => {
  //TODO: siteToBets returns the array of numbers
  return siteToBetsFunction[game.site](game);
  //TODO: parseBets(contractResponse: Array<number>, site)...
};
