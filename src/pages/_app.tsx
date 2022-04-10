import type { AppProps } from 'next/app'
import '../styles/globals.css'

declare global {
  interface Window {
    ethereum?: any
  }
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
