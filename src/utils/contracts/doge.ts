import { ethers } from "ethers";
import { dogeAddress } from "../constants";
import abi from "../abis/dogeBets";
import provider from "../provider";

export default new ethers.Contract(dogeAddress, abi, provider);
