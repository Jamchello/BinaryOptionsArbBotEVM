import { ethers } from "ethers";
import provider from "./provider";

export default new ethers.Wallet(process.env.MASTER_PRIV as string, provider);
