import { ethers } from 'ethers'

const abi = [
  'function balanceOf(address _owner) external view returns (uint256)',
  'function tokenURI(uint256 _tokenId) external view returns (string)',
  'function tokenOfOwnerByIndex(address _owner, uint256 _index) external view returns (uint256)',
]

export class NftContract {
  private _contract: ethers.Contract

  constructor(
    contractAddress: string,
    provider: ethers.providers.ExternalProvider
  ) {
    this._contract = new ethers.Contract(
      contractAddress,
      abi,
      new ethers.providers.Web3Provider(provider)
    )
  }

  async hasNft(address: string) {
    const balance = await this._getBalance(address)
    return balance > 0
  }

  async getTokenIds(address: string) {
    const balance = await this._getBalance(address)
    return await Promise.all(
      Array.from(Array(balance).keys()).map((i) => this._getTokenId(address, i))
    )
  }

  async getTokenUri(tokenId: number) {
    return await this._contract.tokenURI(tokenId)
  }

  private async _getBalance(address: string) {
    const balance: ethers.BigNumber = await this._contract.balanceOf(address)
    return balance.toNumber()
  }

  private async _getTokenId(address: string, index: number) {
    const tokenId: ethers.BigNumber = await this._contract.tokenOfOwnerByIndex(
      address,
      index
    )
    return tokenId.toNumber()
  }
}
