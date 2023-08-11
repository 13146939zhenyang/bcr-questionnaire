'use client'
import React from 'react'
import { QRCode } from 'antd'
import { Logo } from '@/public'

const Qrcode = () => {
  const text = 'https://bcr-questionnaire.vercel.app/'
  return (
    <div className='bg-white'>
      <QRCode value={text || '-'} icon={Logo.src} size={300}
        iconSize={300 / 4} />
    </div>
  )
}
export default Qrcode