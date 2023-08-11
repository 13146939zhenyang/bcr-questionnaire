import type { Metadata } from 'next'
import { Background, Logo } from '@/public'

export const metadata: Metadata = {
  icons: Logo.src,
  title: 'BCR - Transparent and Reliable CFDs Trading Platform',
  description: 'BCR is a trusted and world-leading provider of Contracts for Difference (CFDs) trading. We are committed to delivering transparent and reliable trading services to our clients. With a focus on client satisfaction, we offer a wide range of CFDs on various asset classes, including Forex, metals, commodities, indices, and stocks. Experience the BCR difference and trade with confidence in our transparent and reliable trading platform.',
  keywords: 'Online trading,Transparent and reliable execution,CFD contracts,Forex,Metal trading,Commodity trading,Index trading,Stock trading,High liquidity,Advanced trade execution,World-leading trading provider,Client service,Global community,Trading tools,Financial markets,Expertise,Integrity,Financial goals'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className='w-screen h-screen bg-cover bg-no-repeat bg-center'
        style={{ backgroundImage: `url(${Background.src})` }}>
        <main
          className='bg-[#070B10] bg-opacity-30 backdrop-filter backdrop-blur-md shadow-2xl w-full h-full flex justify-center items-center overflow-scroll py-4'
        // className='flex justify-center items-center overflow-scroll py-4'
        >
          {children}
        </main></body>
    </html>
  )
}
