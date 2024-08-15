'use client'
import { db } from '@/app/firebase'
import WinnerPicker from '@/components/winner-picker'
import WinnerPicker2 from '@/components/winner-picker-2'
import { doc, setDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'

export default function Page() {
  const [allPeople, setAllPeople] = useState([
    "Ali", "Ajmal", "Jawad", "Fahnaz", "Fays", "Fayz", "Khaleel", "Rashid", "Salman", "Sejin"
  ])
  const [selectedPeople, setSelectedPeople] = useState([
    "Ali", "Ajmal", "Jawad", "Fahnaz", "Fays", "Fayz", "Khaleel", "Rashid", "Salman", "Sejin"
  ])
  const [isOn, setIsOn] = useState(false)


  const [data, setData] = useState({
    isSpinning: false,
    currentHighlight: null,
    winner: null,
    isJugad: isOn,
    selected: allPeople
  });

  const handleSave = async () => {
    await setDoc(doc(db, "draw", "currentWinner"), { ...data, selected: selectedPeople, isJugad: isOn });
    console.log(data);
  }

  const handleCheckboxChange = (person) => {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  }

  const handleToggle = () => {
    setIsOn(!isOn)
  }

  useEffect(() => {
    handleSave()
  }, [selectedPeople, isOn])
  return (
    <div className='container mx-auto px-[5%] flex flex-col md:flex-row items-center justify-around'>
      <div className='md:max-w-[70%] w-full'>
        <WinnerPicker />
      </div>
      {/* <WinnerPicker2 /> */}
      <div className='flex flex-col gap-2'>
        <div className='flex gap-3'>
          <div
            className={`${isOn ? 'bg-green-500' : 'bg-gray-300'
              } w-14 h-8 flex items-center rounded-full p-1 cursor-pointer`}
            onClick={handleToggle}
          >
            <div
              className={`${isOn ? 'translate-x-6' : 'translate-x-0'
                } bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300`}
            />
          </div>
          <p>Jugad Mode</p>
        </div>
        <ul>
          {allPeople.map((person) => (
            <li key={person} className='flex gap-3'>
              <input
                type="checkbox"
                checked={selectedPeople.includes(person)}
                onChange={() => handleCheckboxChange(person)}
              />
              <label>{person}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
