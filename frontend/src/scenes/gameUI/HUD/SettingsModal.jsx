import { useState } from "react";
import { X, Volume2, Sun, LogOut, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBrightness } from "../../utils/BrightnessContext";
import { useVolume } from "../../utils/VolumeContext"; // Add this import

export default function SettingsModal({ onClose }) {
  const navigate = useNavigate();
  const [confirmExit, setConfirmExit] = useState(false);
  const { brightness, setBrightness } = useBrightness();
  const { volume, setVolume } = useVolume(); // Add this hook

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-indigo-900/20 backdrop-blur-md px-4">
      <div className="w-full max-w-sm bg-white border-4 border-indigo-900 p-8 rounded-[3rem] shadow-[15px_15px_0_0_#4338ca] relative">
        {!confirmExit && (
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 bg-red-500 border-4 border-indigo-900 p-2 rounded-xl shadow-[4px_4px_0_0_#4338ca] hover:translate-y-1 hover:shadow-none transition-all"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        )}

        {!confirmExit ? (
          <>
            <h2 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter mb-8 text-center">
              Options
            </h2>

            <div className="space-y-8">
              {/* VOLUME SLIDER - NOW FUNCTIONAL */}
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-xl border-2 border-indigo-900">
                  <Volume2 className="text-indigo-900" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-3 bg-indigo-50 rounded-lg appearance-none border-2 border-indigo-900"
                />
              </div>

              {/* BRIGHTNESS SLIDER */}
              <div className="flex items-center gap-4">
                <div className="bg-indigo-100 p-3 rounded-xl border-2 border-indigo-900">
                  <Sun className="text-indigo-900" />
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-3 bg-indigo-50 rounded-lg appearance-none border-2 border-indigo-900"
                />
              </div>
            </div>

            <button
              onClick={() => setConfirmExit(true)}
              className="w-full mt-10 bg-red-500 hover:bg-red-600 text-white py-4 rounded-2xl text-xl font-black border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
            >
              <LogOut /> EXIT GAME
            </button>
          </>
        ) : (
          <div className="text-center animate-in zoom-in duration-200">
            <h2 className="text-3xl font-black text-indigo-900 uppercase tracking-tighter mb-4">
              Leaving So Soon?
            </h2>
            <p className="font-bold text-indigo-700/70 mb-8 uppercase text-sm">
              Make sure you saved your progress!
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate("/login")}
                className="w-full bg-red-500 text-white py-4 rounded-2xl text-xl font-black border-b-8 border-red-900 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-2"
              >
                <Check /> YES, EXIT
              </button>

              <button
                onClick={() => setConfirmExit(false)}
                className="w-full bg-indigo-100 text-indigo-900 py-4 rounded-2xl text-xl font-black border-b-8 border-indigo-300 active:border-b-0 active:translate-y-2 transition-all"
              >
                NO, STAY! 🎮
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
