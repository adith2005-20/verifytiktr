import { ethers } from "ethers";

// ✅ Define MetaMask provider type explicitly
interface MetaMaskEthereum extends Window {
  ethereum?: ethers.Eip1193Provider;
}

const CONTRACT_ADDRESS = "0xcabe839e007da417acb15d7736a2c5b5ad257091";
const CONTRACT_ABI = [
  "function burnTicketByGuard(uint256 tokenId)",
  "function useTicket(uint256 tokenId)",
  "function authorizeGuardForEvent(uint256 eventId, address guard, bool authorized)"
];

export const connectWallet = async (): Promise<ethers.JsonRpcSigner> => {
  const { ethereum } = window as MetaMaskEthereum;

  if (!ethereum) {
    throw new Error("MetaMask not installed");
  }

  // ✅ Ensure proper type safety for the provider
  const provider = new ethers.BrowserProvider(ethereum);
  await provider.send("eth_requestAccounts", []);
  return await provider.getSigner();
};

export const getContractInstance = (signer: ethers.JsonRpcSigner): ethers.Contract => {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
