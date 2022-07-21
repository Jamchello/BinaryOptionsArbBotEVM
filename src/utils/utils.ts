import { BigNumber } from "ethers/lib/ethers";
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

//function to calculate whether placing a bet is worth it while considering the associated gas fees.
//returns a length 2 boolean array, [0] corresponding to bullish, and [1] corresponding to bearish
//i.e if array[0] == true then bullish bet is worth it including gas fees.

const isWorthAfterGas  = (betAmount: number,
  gasPrice: BigNumber,
  game1:gameDataWithValues,
  game2: gameDataWithValues,
  game1Odds: number[],
  game2Odds: number[]
  ): boolean[] =>{
  const betDirectionWorth = [false, false]
  const game1_gasLimit = games[game1.site].gasLimit;
  const games2_gasLimit = games[game2.site].gasLimit;
  const maximumGasFee = parseFloat(formatEther((game1_gasLimit * gasPrice.toNumber()) + (games2_gasLimit * gasPrice.toNumber())));
  

  //see if our profit is larger than our gas fee.
  if( ((game1Odds[0] - 2) * betAmount > maximumGasFee) && ((game2Odds[1] -2) * betAmount > maximumGasFee) ) {
    betDirectionWorth[0] = true;
  }

  if( ((game1Odds[1] -2) * betAmount > maximumGasFee) && ((game2Odds[0] -2) * betAmount > maximumGasFee) ) {
    betDirectionWorth[1] = true;
  }
  
  return betDirectionWorth;



}

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
  const [bullishWorth, bearishWorth] = isWorthAfterGas(betAmount, gasPrice, game1, game2, game1Odds, game2Odds)
  console.log(bullishWorth, bearishWorth)
  let transactions = [];

  if (game1Odds[0] > 2 && game2Odds[1] > 2 ) {
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
    console.log('pushed tx 1');

    transactions.push(
      games[game2.site].makeBet({
        activeEpoch: game2.activeEpoch,
        side: BetDirection.BEAR,
        amount: betAmount.toString(),
        gasPrice,
        nonce: nonce + 1,
      })
    );
    console.log('pushed tx 2');
    console.log(
      `placed ${betAmount} BNB bull @${game1Odds[0]} on ${game1.site}, & ${betAmount} BNB bear @${game2Odds[1]} on ${game2.site}`
    );

  } else if (game1Odds[1] > 2 && game2Odds[0] > 2 ) {
    console.log("Attempting to place bet");
    transactions.push(
      games[game2.site].makeBet({
        activeEpoch: game2.activeEpoch,
        side: BetDirection.BULL,
        amount: betAmount.toString(),
        gasPrice,
        nonce,
      })
    );
    console.log('pushed tx 1');

    transactions.push(
      games[game1.site].makeBet({
        activeEpoch: game1.activeEpoch,
        side: BetDirection.BEAR,
        amount: betAmount.toString(),
        gasPrice,
        nonce,
      })
    );
    console.log('pushed tx 2');
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
