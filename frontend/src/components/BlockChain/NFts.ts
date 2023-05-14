import { ethers } from "ethers";

export type NFTtype = {
  skinName: string;
  abi: ethers.InterfaceAbi;
  address: string;
  imgUrl: string;
};

import electricNFTContractAbi from "./abi/ElectricBounser.json";
const electricNFTContract: NFTtype = {
  skinName: "Electric",
  abi: electricNFTContractAbi.abi,
  address: "0x2A114e5Fc1DF27b80619390DB15E7b41F44e756E",
  imgUrl: "",
};

import loveNFTContractAbi from "./abi/LoveBounser.json";
const loveNFTContract: NFTtype = {
  skinName: "Love",
  abi: loveNFTContractAbi.abi,
  address: "0x0D87df08673e6116A91d393B9f994449fd943c43",
  imgUrl: "",
};

export const nftContracts: NFTtype[] = [electricNFTContract, loveNFTContract];
