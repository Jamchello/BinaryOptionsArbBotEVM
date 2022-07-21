import { ethers, Wallet } from "ethers";
import { dogeAddress } from "../constants";
import abi from "../abis/dogeBets";
import provider from "../provider";

export default (wallet?: Wallet) =>
  new ethers.Contract(dogeAddress, abi, wallet || provider);
