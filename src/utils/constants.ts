import { ethers, utils } from "ethers";
import pancakeSwapAbi from "./abis/pancakeSwap";
import predABI from "./abis/prdt";
import dogeBetsAbi from "./abis/dogeBets";
import candleGenieAbi from "./abis/candleGenieAbi";
import { Filter, gameData, Site } from "../types";
export const pancakeSwapAddress =
  process.env.PANCAKE_ADDRESS || "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA";
export const predAddress =
  process.env.PRED_ADDRESS || "0x31b8a8ee92961524fd7839dc438fd631d34b49c6";
export const dogeAddress =
  process.env.DOGEBETS_ADDRESS || "0x76f2c7c0DeDca9B693630444a9526e95B3A6918e";
export const candleGenieAddress =
  process.env.CANDLEGENIE_ADDRESS ||
  "0xfdd38f9Be523Aff1AA5404B8203ABBD027e70dAD";
const predReadAddress = "0xbe6cb6eadf1bf80a991eb6f6fbf865ef6ba26e3b";
export const minimumInterval = parseInt(process.env.minInterval || "10000");
export const prdtFilter = {
  address: predAddress,
  topics: [
    "0x03fc69733d229811c6f5d9389f934e40c67358759c2e1171b3998ff48d832de4",
  ],
};
export const dogeFilter = {
  address: dogeAddress,
  topics: [
    "0x939f42374aa9bf1d8d8cd56d8a9110cb040cd8dfeae44080c6fcf2645e51b452",
  ],
};
export const pancakeSwapFilter = {
  address: pancakeSwapAddress,
  topics: [utils.id("StartRound(uint256)")],
};

export const candleGenieFilter = {
  address: candleGenieAddress,
  topics: [
    "0x33a701182892fd888ed152ca2ac23771a32e814469b7cd255965471e1af3a659",
  ],
};

const bscWs = process.env.RPC_URL;
export const provider = new ethers.providers.WebSocketProvider(bscWs as string);
export const pancakeSwapInstance = new ethers.Contract(
  pancakeSwapAddress,
  pancakeSwapAbi,
  provider
);

export const dogeBetsInstance = new ethers.Contract(
  dogeAddress,
  dogeBetsAbi,
  provider
);

export const candleGenieInstance = new ethers.Contract(
  candleGenieAddress,
  candleGenieAbi,
  provider
);

export const predInstance = new ethers.Contract(
  predReadAddress,
  predABI,
  provider
);

//TODO: condense the indices into here; remove all the junk helpers/handlers
export const games: Array<{
  site: Site;
  filter: Filter;
  bullIndex?: number;
  bearIndex?: number;
  betsHandler?: (game: gameData) => Promise<Array<number>>;
}> = [
  {
    site: "Doge",
    filter: dogeFilter,
    bullIndex: 1,
    bearIndex: 2,

  },
  {
    site: "PRDT",
    filter: prdtFilter,
    bullIndex: 2,
    bearIndex: 3,
  },
  {
    site: "PancakeSwap",
    filter: pancakeSwapFilter,
    bullIndex: 9,
    bearIndex: 10,
  },
  {
    site: "Genie",
    filter: candleGenieFilter,
    bullIndex: 1,
    bearIndex: 2,
  },
];
