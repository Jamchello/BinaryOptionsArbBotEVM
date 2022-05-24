import { formatEther } from "ethers/lib/utils";
import { addEmitHelper } from "typescript";
import { gameData, betDirection} from "../types";
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
  throw new Error("failed parsing");
};

//function to calculate the optimal way to bet
//takes two games, and assigns a betDirection enum value to each of the games that corresponds to which way you should bet on the game
export const calculateBestBet = (game1 : gameData, game2: gameData)  => {
  if(game1.multiplierBear && game1.multiplierBull && game2.multiplierBear && game2.multiplierBull){
    let scenario1 = game1.multiplierBear + game2.multiplierBull;
    let scenario2 = game2.multiplierBear + game1.multiplierBull;
    if(scenario1 >=2 && scenario2 >=2){
      scenario1 = scenario1 - 4;
      scenario2 = scenario2 - 4;
      const bestOption = (scenario1 >= scenario2)? scenario1: scenario2;
    
      if(scenario1 === bestOption){
        game1.betDirection = betDirection.BEAR;
        game2.betDirection = betDirection.BULL;
      }else{
        game2.betDirection = betDirection.BEAR;
        game1.betDirection = betDirection.BULL;
      }
      console.log(`Game 1 ${game1.betDirection}, Game 2 ${game2.betDirection}`);
  }    
    return [game1, game2]
  }

  console.log("no bet");
}

export const calculateRatiosWithBet = (
  game: gameData,
  total: number,
  bear: number,
  bull: number,
  betAmount: number
): number[] => {
  total = total + betAmount;
  if (game.betDirection === betDirection.BEAR) {
    bear = bear + betAmount;
  } else if (game.betDirection === betDirection.BULL) {
    bull = bull + betAmount;
  }
  const bearRatio = total / bear;
  const bullRatio = total / bull ;


  return [bearRatio, bullRatio];
};