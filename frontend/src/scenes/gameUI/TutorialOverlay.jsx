import React, { useState, useEffect } from "react";
import { useMission } from "../missions/MissionContext";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Gamepad2,
  UserCircle,
  MapPin,
  Target,
  Save,
} from "lucide-react";

const slides = [
  {
    title: "Movement Controls",
    text: "Use WASD or Arrow Keys, along with your mouse, to move your character around the office.",
    icon: Gamepad2,
    imageSrc: "/images/movement.png", // ← your path
    imageAlt: "Movement controls diagram",
  },
  {
    title: "Find Tasks",
    text: "Talk to the Manager to find your assigned tasks and missions.",
    icon: UserCircle,
    imageSrc: "/images/Manager.png",
    imageAlt: "Manager NPC in the office",
  },
  {
    title: "Your Workspace",
    text: "The desk with the marker hovering over it is your personal workspace.",
    icon: MapPin,
    imageSrc: "/images/Mission.png",
    imageAlt: "Player desk with marker",
  },
  {
    title: "Minigames",
    text: "Keep an eye out for the mission marker to locate and play the Cyber Shooter minigame!",
    icon: Target,
    imageSrc: "/images/Marker.png",
    imageAlt: "Cyber Shooter minigame preview",
  },
  {
    title: "Save Progress",
    text: "Don't forget to regularly save your game progress using the Save icon in the HUD.",
    icon: Save,
    imageSrc: "/images/Save.png",
    imageAlt: "Save icon in the HUD",
  },
];

export default function TutorialOverlay() {
  const {
    isTutorialOpen,
    setIsTutorialOpen,
    hasSeenTutorial,
    setHasSeenTutorial,
  } = useMission();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!hasSeenTutorial) {
      setIsTutorialOpen(true);
    }
  }, [hasSeenTutorial, setIsTutorialOpen]);

  if (!isTutorialOpen) return null;

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      closeTutorial();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const closeTutorial = () => {
    setIsTutorialOpen(false);
    setHasSeenTutorial(true);
  };

  const { icon: SlideIcon, imageSrc, imageAlt } = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white border-4 border-indigo-900 rounded-xl shadow-[8px_8px_0_0_#4338ca] flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="bg-indigo-900 p-4 border-b-4 border-indigo-900 flex justify-between items-center">
          <h2 className="text-white font-black text-xl tracking-wider uppercase drop-shadow-sm">
            Welcome to Guardians
          </h2>
          <button
            onClick={closeTutorial}
            className="text-white hover:text-fuchsia-400 transition-colors"
          >
            <X size={28} className="drop-shadow-md" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-col md:flex-row h-[420px]">
          {/* Left Side */}
          <div className="flex-1 p-8 flex flex-col justify-center border-b-4 md:border-b-0 md:border-r-4 border-indigo-900 bg-slate-50 relative">
            <h3 className="text-4xl font-black text-indigo-900 mb-6 uppercase tracking-tight">
              {slides[currentSlide].title}
            </h3>
            <p className="text-xl text-indigo-800 font-bold leading-relaxed mb-8">
              {slides[currentSlide].text}
            </p>
            <div className="absolute bottom-6 left-8 flex gap-3">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-3 rounded-full transition-all duration-300 border-2 border-indigo-900 ${
                    idx === currentSlide
                      ? "w-10 bg-fuchsia-500"
                      : "w-3 bg-white"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Image Side */}
          <div className="flex-1 bg-indigo-100 flex flex-col justify-center items-center p-8 relative overflow-hidden group">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 to-transparent" />
            <div className="w-full h-full relative flex items-center justify-center border-4 border-indigo-200 rounded-2xl bg-white/60 backdrop-blur-sm z-10 p-4 transition-transform group-hover:scale-[1.02] overflow-hidden">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className="w-full h-full object-contain rounded-2xl"
                />
              ) : (
                <div className="text-center text-indigo-500 opacity-70 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                  <SlideIcon size={80} className="mb-4 text-indigo-400" />
                  <span className="font-black text-2xl uppercase tracking-widest drop-shadow-sm">
                    IMAGE
                  </span>
                  <span className="font-bold text-sm mt-2">
                    Replace with `{"<img />"}` element
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-indigo-50 p-5 border-t-4 border-indigo-900 flex justify-between items-center">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wider rounded-lg border-4 transition-all
              ${
                currentSlide === 0
                  ? "bg-gray-200 border-gray-400 text-gray-500 cursor-not-allowed opacity-50"
                  : "bg-white border-indigo-900 text-indigo-900 hover:bg-indigo-100 active:translate-y-1 shadow-[4px_4px_0_0_#4338ca] hover:shadow-[2px_2px_0_0_#4338ca]"
              }`}
          >
            <ChevronLeft size={24} />
            Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-10 py-3 bg-fuchsia-500 border-4 border-indigo-900 text-white font-black uppercase tracking-wider rounded-lg hover:bg-fuchsia-400 hover:-translate-y-1 active:translate-y-1 transition-all shadow-[6px_6px_0_0_#4338ca] hover:shadow-[8px_8px_0_0_#4338ca] active:shadow-[0px_0px_0_0_#4338ca]"
          >
            {currentSlide === slides.length - 1 ? "Start Game" : "Next"}
            {currentSlide !== slides.length - 1 && <ChevronRight size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
}
