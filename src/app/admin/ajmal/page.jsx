'use client'
import WinnerPicker from '@/components/winner-picker'
import WinnerPicker2 from '@/components/winner-picker-2'
import React, { useState } from 'react'

export default function Page() {
  const [isOn, setIsOn] = useState(false)
  const handleToggle = () => {
    setIsOn(!isOn)
  }
  return (
    <div>
      {/* <div
        className={`${isOn ? 'bg-green-500' : 'bg-gray-300'
          } w-14 h-8 flex items-center rounded-full p-1 cursor-pointer`}
        onClick={handleToggle}
      >
        <div
          className={`${isOn ? 'translate-x-6' : 'translate-x-0'
            } bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300`}
        />
      </div> */}
      <WinnerPicker />
      <WinnerPicker2 />
    </div>
  )
}
