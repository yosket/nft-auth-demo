import Image from 'next/image'
import { FC } from 'react'
import { NftContract } from '../lib/NftContract'

const contractAddress = '0x617913Dd43dbDf4236B85Ec7BdF9aDFD7E35b340'

type Props = {
  onSignedIn: () => void
}

const SignedOutState: FC<Props> = ({ onSignedIn }) => {
  const handleConnect = async () => {
    if (!window.ethereum) {
      return
    }
    const [address]: string[] = await window.ethereum?.request({
      method: 'eth_requestAccounts',
    })
    const nftContract = new NftContract(contractAddress, window.ethereum)
    const hasNft = await nftContract.hasNft(address)
    if (!hasNft) {
      return
    }
    const [tokenId] = await nftContract.getTokenIds(address)
    const tokenUri = await nftContract.getTokenUri(tokenId)
    const tokenInfo = await fetch(tokenUri).then((res) => res.json())
    console.log(tokenInfo)
    onSignedIn()
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
      <p className="text-5xl text-center">🔐</p>
      <h1 className="text-3xl font-bold text-center">NFT Authentication</h1>
      <p className="text-gray-400">
        You can sign in if you have the following NFT
      </p>
      <div className="bg-gray-100 shadow-inner p-8 rounded-3xl flex items-center space-x-4">
        <div className="rounded-full overflow-hidden w-10 h-10">
          <Image src="/ens.jpeg" width={40} height={40} alt="" />
        </div>
        <p>Ethereum Name Service (ENS)</p>
      </div>
      <div className="flex justify-center">
        <button
          className="bg-blue-400 py-4 px-16 rounded-3xl text-white relative"
          onClick={handleConnect}
        >
          Sign in with Wallet
        </button>
      </div>
    </div>
  )
}

export default SignedOutState
