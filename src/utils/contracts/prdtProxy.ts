import { ethers, Wallet } from "ethers";
import { predReadAddress } from "../constants";
import provider from "../provider";
import abi from "../abis/pancakeSwap";

export default (wallet?: Wallet) =>
  new ethers.Contract(predReadAddress, abi, wallet || provider);
