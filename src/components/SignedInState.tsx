import confetti from 'canvas-confetti'
import { FC, useEffect } from 'react'

type Props = {}

const SignedInState: FC<Props> = () => {
  useEffect(() => {
    confetti({
      zIndex: 999,
      particleCount: 100,
      spread: 70,
      origin: { x: 0.5, y: 0.7 },
    })
  }, [])

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-8">
      <p className="text-5xl text-center">🔐</p>
      <h1 className="text-3xl font-bold text-center">NFT Authentication</h1>
      <p className="text-5xl text-green-500 font-bold text-center">Success</p>
    </div>
  )
}

export default SignedInState
