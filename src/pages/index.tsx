import {
  ArrowRightIcon,
  CheckCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/outline'
import confetti from 'canvas-confetti'
import classNames from 'classnames'
import { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import SpinnerIcon from '../components/SpinnerIcon'
import { NftContract } from '../lib/NftContract'

const contractAddress = '0x617913Dd43dbDf4236B85Ec7BdF9aDFD7E35b340'

const HomePage: NextPage = () => {
  const [status, setStatus] = useState<'ready' | 'processing' | 'completed'>(
    'ready'
  )
  const [hasError, setHasError] = useState<boolean>(false)
  const [tokenImageUrl, setTokenImageUrl] = useState<string>()

  const handleConnect = async () => {
    try {
      setStatus('processing')
      if (!window.ethereum) {
        throw new Error('has no wallet')
      }
      const [address]: string[] = await window.ethereum?.request({
        method: 'eth_requestAccounts',
      })
      const nftContract = new NftContract(contractAddress, window.ethereum)
      const hasNft = await nftContract.hasNft(address)
      if (!hasNft) {
        throw new Error('has no NFT')
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
          500
        )
      }, 2000)
    } catch (e) {
      console.error(e)
      setHasError(true)
      setStatus('completed')
    }
  }

  return (
    <div className="relative w-screen h-screen">
      <Image src="/bg.jpg" layout="fill" objectFit="cover" alt="" />

      <div className="absolute z-10 w-screen h-screen flex justify-center items-center p-8">
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
                  <div className="text-center">
                    <div className="inline-flex justify-center bg-white p-4 shadow-inner rounded-3xl">
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
                  </div>
                  <ul className="space-y-4">
                    <li className="bg-white p-4 rounded-3xl flex items-center space-x-4 shadow-inner">
                      <span className="text-2xl">🔍</span>
                      <span className="flex-1">
                        Checking the status of the NFT.
                      </span>
                      {!hasError &&
                        (tokenImageUrl ? (
                          <CheckCircleIcon className="w-10 text-teal-400" />
                        ) : (
                          <SpinnerIcon className="h-10 w-10 text-sky-400" />
                        ))}
                    </li>
                    <li className="bg-white p-4 rounded-3xl flex items-center space-x-4 shadow-inner">
                      <span className="text-2xl">📝</span>
                      <span className="flex-1">
                        Signing and its verification.
                      </span>
                      {!hasError &&
                        (tokenImageUrl && status === 'completed' ? (
                          <CheckCircleIcon className="w-10 text-teal-400" />
                        ) : !!tokenImageUrl ? (
                          <SpinnerIcon className="h-10 w-10 text-sky-400" />
                        ) : null)}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-8 flex-shrink-0 w-120">
                {hasError ? (
                  <div className="space-y-8 flex flex-col items-center justify-center h-full">
                    <p style={{ fontSize: '5rem' }}>🥲</p>
                    <p className="text-4xl text-rose-500 font-bold text-center">
                      Authentication Failed...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8 flex flex-col items-center justify-center h-full">
                    <p style={{ fontSize: '5rem' }}>🎉</p>
                    <p className="text-4xl text-teal-500 font-bold text-center">
                      Authentication Successful
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
