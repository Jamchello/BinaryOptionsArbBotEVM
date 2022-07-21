import { utils } from "ethers";
export const pancakeSwapAddress =
  process.env.PANCAKE_ADDRESS || "0x18B2A687610328590Bc8F2e5fEdDe3b582A49cdA";
export const predAddress =
  process.env.PRED_ADDRESS || "0x31b8a8ee92961524fd7839dc438fd631d34b49c6";
export const dogeAddress =
  process.env.DOGEBETS_ADDRESS || "0x76f2c7c0DeDca9B693630444a9526e95B3A6918e";
export const candleGenieAddress =
  process.env.CANDLEGENIE_ADDRESS ||
  "0xfdd38f9Be523Aff1AA5404B8203ABBD027e70dAD";
export const predReadAddress = "0xbe6cb6eadf1bf80a991eb6f6fbf865ef6ba26e3b";
export const minimumInterval = parseInt(process.env.MIN_INTERVAL || "15000");
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
