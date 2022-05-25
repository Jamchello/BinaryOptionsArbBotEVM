import { formatEther } from "ethers/lib/utils";
import { addEmitHelper } from "typescript";
import { gameData, BetDirection, gameDataWithValues } from "../types";
import games from "./games";

//pass in roundsData object and gameData object
//Handles contract parsing for all the different games
export const getGameBets = async (game: gameData) => {
  const { bearIndex, bullIndex, betsHandler } = games[game.site];
  const roundsData = await betsHandler(game);

  const bull = parseFloat(formatEther(roundsData[bearIndex].toString()));
  const bear = parseFloat(formatEther(roundsData[bullIndex].toString()));
  const total = bear + bull;

  console.log(`${game.site} totals: Bull=${bull}, Bear=${bear}`);
  return [total, bear, bull];
};

const calculateRatioWithBet = (
  game: gameDataWithValues,
  betAmount: number
): [number, number] => {
  const { total, bear, bull } = game;

  const bullBet = (total + betAmount) / (bull + betAmount);

  const bearBet = (total + betAmount) / (bear + betAmount);

  return [bullBet, bearBet];
};

// const validateWorth = (
//   game1: gameDataWithValues,
//   game2: gameDataWithValues
// ): Boolean => {};

//function to calculate the optimal way to bet
//takes two games, and assigns a betDirection enum value to each of the games that corresponds to which way you should bet on the game
export const makeBestBets = (
  game1: gameDataWithValues,
  game2: gameDataWithValues,
  betAmount: number
) => {
  const game1Odds = calculateRatioWithBet(game1, 1);
  const game2Odds = calculateRatioWithBet(game2, 1);
  if (
    game1Odds[0] < 2 &&
    game2Odds[1] < 2 &&
    game1Odds[1] < 2 &&
    game2Odds[0] < 2
  ) {
    //Both scenarios possible; calculate the highest returning
    const a = game1Odds[0] + game2Odds[1];
    const b = game1Odds[1] + game2Odds[0];
    //if a > b, bet bull on g1, bear on g2
    //else bet bear on g1, bull on g2
    console.log(
      a > b
        ? `placed ${betAmount} BNB bull @${game1Odds[0]} on ${game1.site}, & ${betAmount} BNB bear @${game2Odds[1]} on ${game2.site}`
        : `placed ${betAmount} BNB bull @${game2Odds[0]} on ${game2.site}, & ${betAmount} BNB bear @${game1Odds[1]} on ${game1.site}`
    );
  } else if (game1Odds[0] > 2 && game2Odds[1] > 2) {
    console.log(
      `placed ${betAmount} BNB bull @${game1Odds[0]} on ${game1.site}, & ${betAmount} BNB bear @${game2Odds[1]} on ${game2.site}`
    );
    //Take bull on game1, bear on game2
  } else if (game1Odds[1] > 2 && game2Odds[0] > 2) {
    console.log(
      `placed ${betAmount} BNB bull @${game2Odds[0]} on ${game2.site}, & ${betAmount} BNB bear @${game1Odds[1]} on ${game1.site}`
    );
  } else {
    console.log("no bets worth taking");
  }
};
