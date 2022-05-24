import { formatEther } from "ethers/lib/utils";
import { gameData } from "../types";
import games from "./games";

//pass in roundsData object and gameData object
//Handles contract parsing for all the different games
const getGameBets = async (game: gameData) => {
  const { bearIndex, bullIndex, betsHandler } = games[game.site];
  const roundsData = await betsHandler(game);
  //if all three are defined (i.e we have no errors, then parse accordingly)
  const bull = parseFloat(formatEther(roundsData[bearIndex].toString()));
  const bear = parseFloat(formatEther(roundsData[bullIndex].toString()));
  const total = bear + bull;

  console.log(`${game.site} totals: Bull=${bull}, Bear=${bear}`);
  return [total, bear, bull];
  throw new Error("failed parsing");
};
