import { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import SignedInState from '../components/SignedInState'
import SignedOutState from '../components/SignedOutState'

const HomePage: NextPage = () => {
  const [isSucceeded, setIsSucceeded] = useState<boolean>(false)

  return (
    <div className="relative w-screen h-screen">
      <Image src="/bg.jpg" layout="fill" objectFit="cover" alt="" />

      <div className="absolute z-10 w-screen h-screen flex justify-center items-center p-8">
        {isSucceeded ? (
          <SignedInState />
        ) : (
          <SignedOutState onSignedIn={() => setIsSucceeded(true)} />
        )}
      </div>
    </div>
  )
}

export default HomePage
