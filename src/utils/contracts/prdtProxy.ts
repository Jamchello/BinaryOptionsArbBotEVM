import { ethers, Wallet } from "ethers";
import { predReadAddress } from "../constants";
import provider from "../provider";
import abi from "../abis/prdt";

export default (wallet?: Wallet) =>
  new ethers.Contract(predReadAddress, abi, wallet || provider);
