import {
  ArrowRightIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import confetti from 'canvas-confetti'
import classNames from 'classnames'
import Image from 'next/image'
import { FC, useState } from 'react'
import { NftContract } from '../lib/NftContract'
import SpinnerIcon from './SpinnerIcon'

const contractAddress = '0x617913Dd43dbDf4236B85Ec7BdF9aDFD7E35b340'

type Props = {
  onSignedIn: () => void
}

const SignedOutState: FC<Props> = () => {
  const [status, setStatus] = useState<'ready' | 'processing' | 'completed'>(
    'ready'
  )
  const [tokenImageUrl, setTokenImageUrl] = useState<string>()

  const handleConnect = async () => {
    setStatus('processing')
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
    setTokenImageUrl(tokenInfo.image)
    setTimeout(() => {
      setStatus('completed')
      setTimeout(
        () =>
          confetti({
            zIndex: 999,
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.8 },
          }),
        1000
      )
    }, 2000)
  }

  return (
    <div className="relative bg-white rounded-3xl shadow-2xl w-240 h-120">
      <div className="overflow-hidden h-full rounded-3xl">
        <div
          className={classNames(
            'flex h-full transition-transform transform duration-500',
            {
              '-translate-x-120': status === 'processing',
              '-translate-x-240': status === 'completed',
            }
          )}
        >
          <div className="bg-slate-100 p-8 flex-shrink-0 w-120">
            <div className="w-full h-full flex flex-col space-y-8 items-center justify-center">
              <p className="text-5xl text-center">🔐</p>
              <h1 className="text-3xl text-slate-500 font-bold text-center">
                NFT Auth Demo
              </h1>
            </div>
          </div>

          <div className="p-8 flex-shrink-0 w-120">
            <div className="flex flex-col h-full justify-center space-y-8">
              <p className="text-slate-400 text-center">
                You can sign in if you have the following NFT
              </p>
              <div className="bg-slate-100 shadow-inner p-8 rounded-3xl flex items-center space-x-4">
                <div className="rounded-full overflow-hidden w-10 h-10 flex-shrink-0">
                  <Image src="/land.png" width={40} height={40} alt="" />
                </div>
                <p>MyCryptoHeroes:Land</p>
              </div>
              <div className="flex justify-center">
                <button
                  className={classNames(
                    'w-80 h-16 rounded-3xl text-white relative bg-sky-400 shadow',
                    { 'opacity-50 cursor-not-allowed': status !== 'ready' }
                  )}
                  onClick={handleConnect}
                  disabled={status !== 'ready'}
                >
                  <span className="flex items-center justify-center space-x-4">
                    {status !== 'ready' ? (
                      <SpinnerIcon className="h-8 w-8 text-white" />
                    ) : (
                      <>
                        <span>Sign in with Wallet</span>
                        <ArrowRightIcon className="text-white w-6" />
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-8 bg-slate-100 flex-shrink-0 w-120">
            <div className="flex flex-col h-full justify-center space-y-8">
              <div className="flex justify-center">
                {tokenImageUrl ? (
                  <img
                    src={tokenImageUrl}
                    width={160}
                    height={160}
                    className="rounded-3xl"
                    alt=""
                  />
                ) : (
                  <QuestionMarkCircleIcon className="text-slate-200 w-40" />
                )}
              </div>
              <ul className="space-y-4">
                <li className="bg-white p-4 rounded-3xl flex items-center space-x-4 shadow-inner">
                  <span className="text-2xl">🔍</span>
                  <span className="flex-1">
                    Checking the status of the NFT.
                  </span>
                  {tokenImageUrl ? (
                    <CheckCircleIcon className="w-10 text-teal-400" />
                  ) : (
                    <SpinnerIcon className="h-10 w-10 text-sky-400" />
                  )}
                </li>
                <li className="bg-white p-4 rounded-3xl flex items-center space-x-4 shadow-inner">
                  <span className="text-2xl">📝</span>
                  <span className="flex-1">Signing and its verification.</span>
                  {tokenImageUrl && status === 'completed' ? (
                    <CheckCircleIcon className="w-10 text-teal-400" />
                  ) : !!tokenImageUrl ? (
                    <SpinnerIcon className="h-10 w-10 text-sky-400" />
                  ) : null}
                </li>
              </ul>
            </div>
          </div>

          <div className="p-8 flex-shrink-0 w-120">
            <div className="space-y-8 flex flex-col items-center justify-center h-full">
              <p style={{ fontSize: '5rem' }}>🎉</p>
              <p className="text-5xl text-teal-500 font-bold text-center">
                Success!!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignedOutState
