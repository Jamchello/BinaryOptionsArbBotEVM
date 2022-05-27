import { formatEther } from "ethers/lib/utils";
import { BetDirection, gameData, gameDataWithValues } from "../types";
import games from "./games";
import wallet from "./wallet";

//pass in roundsData object and gameData object
//Handles contract parsing for all the different games
export const getGameBets = async (game: gameData) => {
  const { bearIndex, bullIndex, fetchGameInfo } = games[game.site];
  const roundsData = await fetchGameInfo(game);

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
export const makeBestBets = async (
  game1: gameDataWithValues,
  game2: gameDataWithValues,
  betAmount: number
) => {
  const nonce = await wallet.getTransactionCount();
  const gasPrice = await wallet.getGasPrice();

  const game1Odds = calculateRatioWithBet(game1, betAmount);
  const game2Odds = calculateRatioWithBet(game2, betAmount);

  let transactions = [];

  if (game1Odds[0] > 2 && game2Odds[1] > 2) {
    console.log("Attempting to place bet");
    transactions.push(
      games[game1.site].makeBet({
        activeEpoch: game1.activeEpoch,
        side: BetDirection.BULL,
        amount: betAmount.toString(),
        gasPrice,
        nonce,
      })
    );

    transactions.push(
      games[game2.site].makeBet({
        activeEpoch: game2.activeEpoch,
        side: BetDirection.BEAR,
        amount: betAmount.toString(),
        gasPrice,
        nonce: nonce + 1,
      })
    );
    console.log(
      `placed ${betAmount} BNB bull @${game1Odds[0]} on ${game1.site}, & ${betAmount} BNB bear @${game2Odds[1]} on ${game2.site}`
    );
    //Take bull on game1, bear on game2
  } else if (game1Odds[1] > 2 && game2Odds[0] > 2) {
    console.log("Attempting to place bet");
    transactions.push(
      games[game2.site].makeBet({
        activeEpoch: game1.activeEpoch,
        side: BetDirection.BULL,
        amount: betAmount.toString(),
        gasPrice,
        nonce,
      })
    );

    transactions.push(
      games[game1.site].makeBet({
        activeEpoch: game2.activeEpoch,
        side: BetDirection.BEAR,
        amount: betAmount.toString(),
        gasPrice,
        nonce,
      })
    );
    console.log(
      `placed ${betAmount} BNB bull @${game2Odds[0]} on ${game2.site}, & ${betAmount} BNB bear @${game1Odds[1]} on ${game1.site}`
    );
  } else {
    console.log("no bets worth taking");
    return;
  }
  await Promise.all(transactions);
  console.log("Transactions Confirmed");
};
