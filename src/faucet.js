import { globalParams } from "./params.js";
import { ethers } from "ethers";
// const ethers = require("ethers");

export default async function faucetTo(receiveAddress, sendAmount) {
  const provider = new ethers.JsonRpcProvider(globalParams.RPC_URL);
  const signer = new ethers.Wallet(globalParams.PRIVATE_KEY, provider);

  try {
    const tx = await signer.sendTransaction({
      to: receiveAddress,
      value: ethers.parseUnits(sendAmount, "ether"),
    });
    console.log(tx);
    return tx;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
}
