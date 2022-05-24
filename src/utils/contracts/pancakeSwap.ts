import { ethers } from "ethers";
import { pancakeSwapAddress } from "../constants";
import abi from "../abis/pancakeSwap";
import provider from "../provider";

export default new ethers.Contract(pancakeSwapAddress, abi, provider);
