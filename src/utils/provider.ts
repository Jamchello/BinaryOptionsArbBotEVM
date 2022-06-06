import { ethers } from "ethers";

export const spawnProvider = () =>
new ethers.providers.WebSocketProvider(
  process.env.RPC_URL as string
);


export default new ethers.providers.WebSocketProvider(
  process.env.RPC_URL as string
);
