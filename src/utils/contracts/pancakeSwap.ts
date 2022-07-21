import { ethers, Wallet } from "ethers";
import { pancakeSwapAddress } from "../constants";
import abi from "../abis/pancakeSwap";
import provider from "../provider";

export default (wallet?: Wallet) =>
  new ethers.Contract(pancakeSwapAddress, abi, wallet || provider);
