import { useProgress } from "@react-three/drei";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onFinish }) {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => {
        setVisible(false);
        onFinish();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [active, progress, onFinish]);

  if (!visible) return null;

  return (
    <motion.div
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-yellow-400 font-sans"
    >
      {/* Main Container - Matches your Login/Signup Card Style */}
      <div className="bg-white p-12 rounded-[3rem] shadow-[10px_10px_0_0_#4338ca] border-4 border-indigo-900 w-full max-w-md text-center">
        {/* Modernized Flying File Animation */}
        <div className="relative h-24 w-full flex items-center justify-between px-8 mb-6 overflow-hidden">
          {/* Source Icon (Computer/Cloud) */}
          <div className="text-4xl z-10">🌐</div>

          {/* Flying File Piece */}
          <motion.div
            initial={{ x: -150, opacity: 0, rotate: 0 }}
            animate={{
              x: 150,
              opacity: [0, 1, 1, 0],
              rotate: 360,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute left-1/2 text-3xl"
          >
            📄
          </motion.div>

          {/* Destination Icon (Folder) */}
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-4xl z-10"
          >
            📂
          </motion.div>
        </div>

        <h1 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter mb-2">
          Downloading Data...
        </h1>
        <p className="text-indigo-600 font-bold mb-8 uppercase text-sm tracking-widest">
          Securing your Hero Cape
        </p>

        {/* Chunky Progress Bar */}
        <div className="relative h-8 w-full bg-indigo-50 rounded-2xl border-4 border-indigo-900 overflow-hidden">
          <motion.div
            className="h-full bg-pink-500 border-r-4 border-indigo-900"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        </div>

        {/* Percentage Label */}
        <div className="mt-4 flex justify-between items-center">
          <span className="bg-indigo-900 text-white px-3 py-1 rounded-full text-xs font-black">
            {progress === 100 ? "READY!" : "LOADING..."}
          </span>
          <span className="text-2xl font-black text-indigo-900 italic">
            {Math.floor(progress)}%
          </span>
        </div>
      </div>

      {/* Floating Background Elements to match Signup.jsx */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-pink-400 rounded-full blur-xl opacity-40 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-24 h-24 bg-indigo-500 rounded-full blur-xl opacity-40 animate-bounce" />
    </motion.div>
  );
}
