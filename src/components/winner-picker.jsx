'use client'
import { useState, useEffect } from 'react';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ClipLoader } from "react-spinners";
import { db } from '@/app/firebase';

export default function WinnerPicker() {
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
      winner: null
    });

    const intervalId = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * people.length);
      setCurrentHighlight(people[randomIndex]);

      // Update the current highlight in Firebase
      setDoc(doc(db, "draw", "currentWinner"), {
        isSpinning: true,
        currentHighlight: people[randomIndex],
        winner: null
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
        winner: selectedWinner
      });

      setIsSpinning(false);
      setWinner(selectedWinner);
    }, 5000); // Adjust the time for spinning duration
  };

  return (
    <div className="flex gap-10 items-center justify-center h-screen">
      <div className='flex flex-col gap-5'>
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
      <ul>
        {people.map((people, id) => (
          <li className={`${winner ? winner == people ? "font-[700]" : "" : currentHighlight == people ? "font-[700]" : ""}`} key={id}>{people}</li>
        ))}
      </ul>
    </div>
  );
}
