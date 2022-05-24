import { ethers } from "ethers";
import { predReadAddress } from "../constants";
import provider from "../provider";
import abi from "../abis/prdt";

export default new ethers.Contract(predReadAddress, abi, provider);
