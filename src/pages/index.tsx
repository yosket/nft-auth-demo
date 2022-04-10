import confetti from 'canvas-confetti'
import { ethers } from 'ethers'
import { NextPage } from 'next'
import Image from 'next/image'
import { hasNft } from '../lib/hasNft'

const HomePage: NextPage = () => {
  const handleConnect = async () => {
    if (!window.ethereum) {
      return
    }
    await window.ethereum?.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    if (await hasNft(provider.getSigner())) {
      handleConfetti()
    }
  }

  const handleConfetti = () => {
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.75 },
    })
  }

  return (
    <div className="relative w-screen h-screen">
      <Image src="/bg.jpg" layout="fill" objectFit="cover" alt="" />

      <div className="absolute z-10 w-screen h-screen flex justify-center items-center p-8">
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
              className="bg-blue-400 p-4 rounded-3xl text-white w-64 relative"
              onClick={handleConnect}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
