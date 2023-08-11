'use client'
import React from 'react'
import ConfettiAnimation from '@/components/ConfettiAnimation'

const Success = () => {
  return (
    <div className='text-white shadow-text text-2xl'>
      <span>Submit Successfully!</span>
      <ConfettiAnimation />
    </div>
  )
}

export default Success