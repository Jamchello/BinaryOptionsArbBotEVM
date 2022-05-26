import { ethers, Wallet } from "ethers";
import { candleGenieAddress } from "../constants";
import provider from "../provider";
import abi from "../abis/candleGenieAbi";

export default (wallet?: Wallet) =>
  new ethers.Contract(candleGenieAddress, abi, wallet || provider);
