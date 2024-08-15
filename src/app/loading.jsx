'use client'
import { motion } from 'framer-motion';
import Image from 'next/image';

const StarkLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <motion.div
        className="relative w-64 h-64"
        animate={{
          // rotate: [0, 360],
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Image src={'/stark.svg'} height={1200} width={1200} alt='stark' className='h-full w-full' />
      </motion.div>
    </div>
  );
};

export default StarkLoading;
