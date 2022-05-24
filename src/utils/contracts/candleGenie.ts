import { ethers } from "ethers";
import { candleGenieAddress } from "../constants";
import provider from "../provider";
import abi from "../abis/candleGenieAbi";

export default new ethers.Contract(candleGenieAddress, abi, provider);
