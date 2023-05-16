import { NFTtype, nftContracts } from "@/components/BlockChain/NFts";
import { ethers } from "ethers";

const getNFTContract = async (
  NFTAddress: string,
  NFTabi: ethers.InterfaceAbi
) => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(NFTAddress, NFTabi, await signer);

  return contract;
};

const getNFT = async (NFTAddress: string, NFTabi: ethers.InterfaceAbi) => {
  const contract = await getNFTContract(NFTAddress, NFTabi);
  try {
    await contract.mint();
  } catch (error) {
    console.log(error);
    alert("get NFT failed");
  }
};

export const getAllNftAvailibility = async (NFTAddress: string) => {
  const nftMap = new Map<string, boolean>();
  for (const contract of nftContracts) {
    try {
      nftMap.set(
        contract.skinName,
        await checkNftExistance(NFTAddress, contract.skinName)
      );
    } catch (error) {
      nftMap.set(contract.skinName, false);
    }
  }
  return nftMap;
};

export const getNFTbyName = async (NFTName: string) => {
  let nft: NFTtype | undefined;
  nftContracts.forEach((contract: NFTtype) => {
    if (contract.skinName === NFTName) {
      nft = contract;
    }
  });

  if (nft === undefined) {
    throw new Error("NFT not found");
  }

  await getNFT(nft.address, nft.abi);
};

/**
 * @description check if the user has the NFT
 */
export async function checkNftExistance(
  NFTAddress: string,
  NFTName: string
): Promise<boolean> {
  if (!NFTAddress) {
    return false;
  }

  let nft: NFTtype | undefined;
  nftContracts.forEach((contract: NFTtype) => {
    if (contract.skinName === NFTName) {
      nft = contract;
    }
  });

  if (nft === undefined) {
    throw new Error("NFT not found");
  }

  const contract = await getNFTContract(nft.address, nft.abi);

  try {
    const accountBalance = await contract.balanceOf(NFTAddress);
    if (accountBalance > 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
