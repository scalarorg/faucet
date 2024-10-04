import { isAddress } from "ethers";

export function isValidEthereumAddress(address) {
  return isAddress(address);
}
