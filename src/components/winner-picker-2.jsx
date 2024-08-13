'use client'
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ClipLoader } from "react-spinners";
import { db } from '@/app/firebase';
import { motion } from 'framer-motion'

export default function WinnerPicker2() {
  const [people, setPeople] = useState([
    "Ali", "Ajmal", "Jawad", "Fahnaz", "Fays", "Khaleel", "Rashid", "Salman", "Sejin"
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
      isJugad: true
    });

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * people.length);
      setCurrentHighlight(people[randomIndex]);

      // Update the current highlight in Firebase
      setDoc(doc(db, "draw", "currentWinner"), {
        isSpinning: true,
        currentHighlight: people[randomIndex],
        winner: null,
        isJugad: true
      });
    }, 100);

    // Stop spinning after a delay and choose a winner
    setTimeout(async () => {
      clearInterval(intervalId);
      const selectedWinner = "Jawad"; // Always select Jawad as the winner

      // Notify all clients of the final winner
      await setDoc(doc(db, "draw", "currentWinner"), {
        isSpinning: false,
        currentHighlight: null,
        winner: selectedWinner,
        isJugad: true
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
      isJugad: true
    });
  }

  return (
    <div className="flex gap-10 items-center justify-center h-screen">
      <div className='flex flex-col gap-5 items-center'>
        <motion.ul className='flex gap-2'>
          {people.map((person, id) => (
            <motion.li
              key={id}
              className="px-2 py-1 text-lg"
              animate={{
                scale: winner === person ? 1.5 : currentHighlight === person ? 1.2 : 1,
                color: winner === person ? '#ff0000' : currentHighlight === person ? '#0000ff' : '#000000',
                fontWeight: winner === person || currentHighlight === person ? 700 : 400,
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
        <button onClick={reset}>Reset</button>
        {isSpinning ? (
          <div className="flex flex-col items-center">
            <ClipLoader color={"#123abc"} loading={true} size={150} />
            <p className="text-xl font-bold mt-4">Spinning...</p>
          </div>
        ) : (
          <>
            <div className="w-80 h-80 flex items-center justify-center bg-yellow-500 rounded-full">
              <p className="text-3xl font-bold">{winner || currentHighlight || "?"}</p>
            </div>
            {!winner && (
              <button
                onClick={startSpin}
                className="mt-10 px-6 py-3 bg-blue-600 text-white rounded-md"
              >
                Start Spin
              </button>
            )}
          </>
        )}
      </div>

    </div>
  );
}
