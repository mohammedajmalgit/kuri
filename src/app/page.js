'use client'
import WinnerPicker from "@/components/winner-picker";
import WinnerPicker2 from "@/components/winner-picker-2";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "./firebase";
import StarkLoading from "./loading";

export default function Home() {
  const [jugad, setJugad] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Listen to the winner being selected in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "draw", "currentWinner"), (doc) => {
      const data = doc.data();
      setJugad(data.isJugad)
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000);
  }, [])

  if (loading) {
    return (
      <StarkLoading />
    )
  }
  else if (jugad) {
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
