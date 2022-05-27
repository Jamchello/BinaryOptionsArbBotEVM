import { ethers } from "ethers";
import { predAddress } from "../constants";
import provider from "../provider";
//Using pancakeswap abi as the bet function is the same...
import abi from "../abis/pancakeSwap";

export default new ethers.Contract(predAddress, abi, provider);
