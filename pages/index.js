import Head from 'next/head'
import { Sidebar } from '../components/sidebar'

export default function Home() {
  return (
    <div>
      <Head>
        <title>WhatsApp-2.0</title>
        <meta name="description" content="Generated by WhatsApp-2.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar></Sidebar>

    </div>
  )
}
