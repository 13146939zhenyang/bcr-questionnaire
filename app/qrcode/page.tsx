'use client'
import React from 'react'
import { QRCode } from 'antd'
import { LogoWhite } from '@/public'

const Qrcode = () => {
  const text = 'https://bcr-questionnaire.vercel.app/'
  return (
    <div>
      <QRCode value={text || '-'} icon={LogoWhite.src} size={300}
        iconSize={300 / 4} />
    </div>
  )
}

export default Qrcode