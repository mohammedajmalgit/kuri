'use client'
import WinnerPicker from "@/components/winner-picker";
import WinnerPicker2 from "@/components/winner-picker-2";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";

export default function Home() {
  const [jugad, setJugad] = useState(null)
  // Listen to the winner being selected in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "draw", "currentWinner"), (doc) => {
      const data = doc.data();
      setJugad(data.isJugad)
      // setIsSpinning(data?.isSpinning || false);
      // setCurrentHighlight(data?.currentHighlight || null);
      // setWinner(data?.winner || null);
    });
    return () => unsubscribe();
  }, []);

  if (jugad) {
    return (
      <div>
        <WinnerPicker2 />
      </div>
    )
  } else {
    return (
      <div>
        <WinnerPicker />
      </div>
    )
  }
}
