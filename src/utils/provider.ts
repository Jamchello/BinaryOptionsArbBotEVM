import { ethers } from "ethers";

export default  () =>  new ethers.providers.WebSocketProvider(
  process.env.RPC_URL as string
);
