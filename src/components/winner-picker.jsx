'use client'
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ClipLoader } from "react-spinners";
import { db } from '@/app/firebase';
import { motion } from 'framer-motion';

export default function WinnerPicker() {
  const [people, setPeople] = useState([
    "Ali", "Ajmal", "Jawad", "Fahnaz", "Fays", "Fays", "Khaleel", "Rashid", "Salman", "Sejin"
  ]); // Replace with your list or fetch from Firebase
  const [currentHighlight, setCurrentHighlight] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  // Listen to the winner being selected in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "draw", "currentWinner"), (doc) => {
      const data = doc.data();
      setIsSpinning(data?.isSpinning || false);
      setCurrentHighlight(data?.currentHighlight || null);
      setWinner(data?.winner || null);
      setPeople(data?.selected)
    });
    return () => unsubscribe();
  }, []);

  // Handle spinning
  const startSpin = async () => {
    setIsSpinning(true);

    // Notify all clients that spinning started
    await setDoc(doc(db, "draw", "currentWinner"), {
      isSpinning: true,
      currentHighlight: null,
      winner: null,
      isJugad: false,
      selected: people
    });

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * people.length);
      setCurrentHighlight(people[randomIndex]);

      // Update the current highlight in Firebase
      setDoc(doc(db, "draw", "currentWinner"), {
        isSpinning: true,
        currentHighlight: people[randomIndex],
        winner: null,
        isJugad: false,
        selected: people
      });
    }, 100);

    // Stop spinning after a delay and choose a winner
    setTimeout(async () => {
      clearInterval(intervalId);
      const finalWinnerIndex = Math.floor(Math.random() * people.length);
      const selectedWinner = people[finalWinnerIndex];

      // Notify all clients of the final winner
      await setDoc(doc(db, "draw", "currentWinner"), {
        isSpinning: false,
        currentHighlight: null,
        winner: selectedWinner,
        isJugad: false,
        selected: people
      });

      setIsSpinning(false);
      setWinner(selectedWinner);
    }, 5000); // Adjust the time for spinning duration
  };

  const reset = async () => {
    setDoc(doc(db, "draw", "currentWinner"), {
      isSpinning: false,
      currentHighlight: null,
      winner: null,
      selected: people
    });
    setWinner(null)
  }
  return (
    <div className="flex gap-10 items-center justify-center h-screen container mx-auto px-[5%]">
      <div className='flex flex-col gap-5 items-center'>
        <motion.ul className='flex flex-wrap gap-2 bg-[#A6A6A6] bg-opacity-70 rounded-full p-[20px]'>
          {people.map((person, id) => (
            <motion.li
              key={id}
              className="px-2 py-1 text-[12px] md:text-lg font-semibold"
              animate={{
                scale: winner === person ? 1.5 : 1,
                color: winner === person ? '#ff0000' : '#000000',
                fontWeight: winner === person ? 700 : 400,
                y: winner === person ? "-30px" : "0px"
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              {person}
            </motion.li>
          ))}
        </motion.ul>
        <>
          <div className="w-80 h-80 flex items-center justify-center bg-yellow-500 rounded-full md:mt-[50px]">
            <p className="text-3xl font-bold">{winner || currentHighlight || "?"}</p>
          </div>
          {!winner ? (
            <button
              onClick={startSpin}
              className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-md"
            >
              Select Winner
            </button>
          )
            :
            (<button
              onClick={reset}
              className="mt-10 px-6 py-3 bg-red-600 text-white rounded-md"
            >
              Reset</button>)
          }
        </>
      </div>
    </div >
  );
}
