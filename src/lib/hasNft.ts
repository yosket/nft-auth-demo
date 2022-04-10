import { ethers } from 'ethers'
import Erc721Abi from '../assets/Erc721Abi.json'

const contractAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'

export const hasNft = async (signer: ethers.Signer): Promise<boolean> => {
  const contract = new ethers.Contract(contractAddress, Erc721Abi, signer)
  const address = await signer.getAddress()
  const balance: ethers.BigNumber = await contract.balanceOf(address)
  return balance.toNumber() > 0
}
