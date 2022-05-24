import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { PassThrough } from "stream";
import { gameData, Rounds } from "../types";
import {
  candleGenieInstance,
  dogeBetsInstance,
  pancakeSwapInstance,
  predInstance,
  games
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
  return parseContractData(data, game);
};

const pancakeBetsHandler = async (game: gameData) => {
  const data = await pancakeSwapInstance.rounds(game.activeEpoch);
  return parseContractData(data, game);
};

const dogeBetsHandler = async (game: gameData) => {
  const data = await dogeBetsInstance.Rounds(game.activeEpoch);
  return parseContractData(data, game);
};

const genieBetsHandler = async (game: gameData) => {
  const data = await candleGenieInstance.Rounds(game.activeEpoch);
  return parseContractData(data, game);
};







//TODO: Single parseContractData function

//pass in roundsData object and gameData object
//Handles contract parsing for all the different games
const parseContractData = (roundsData: Rounds, game: gameData) => {
  let siteName: string = game.site;
  let site = games.find(x=> x.site===siteName);
  const [bearIndex, bullIndex] = [site?.bearIndex, site?.bullIndex];
  //if all three are defined (i.e we have no errors, then parse accordingly)
  if(site && bearIndex && bullIndex){
    const bull = parseFloat(formatEther(roundsData[bearIndex].toString()));
    const bear = parseFloat(formatEther(roundsData[bullIndex].toString()));

    const total = bear + bull;
    console.log(`${siteName} totals: Bull=${bull}, Bear=${bear}`);
    return [total, bear, bull];
    }

  throw new Error("failed parsing");

}






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
