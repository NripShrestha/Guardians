import React, { useState } from "react";

export default function CharacterSelection() {
  const [hoveredCharacter, setHoveredCharacter] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const characters = [
    {
      id: "timmy",
      name: "Cyber Scout",
      color: "bg-cyan-300",
      imageUrl: "/images/Timmy.png",
      tip: "I keep my passwords secret like a ninja!",
    },
    {
      id: "girl",
      name: "Web Warden",
      color: "bg-orange-300",
      imageUrl: "/images/Girl.png",
      tip: "I always think twice before clicking any links!",
    },
  ];

  const handleCharacterSelect = (characterId) => {
    setSelectedCharacter(characterId);
    sessionStorage.setItem("selectedCharacter", characterId);
    setTimeout(() => {
      window.location.href = "/home";
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-emerald-400 p-4 font-sans relative overflow-hidden">
      {/* Playful background shapes - subtle teal/blue */}
      <div className="absolute top-5 left-10 w-16 h-16 bg-blue-500 rounded-full blur-xl opacity-40 animate-pulse"></div>
      <div className="absolute bottom-5 right-10 w-24 h-24 bg-teal-200 rounded-full blur-xl opacity-40"></div>

      {/* Main Container - Scaled down */}
      <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-[10px_10px_0_0_#1e1b4b] border-4 border-indigo-950 w-full max-w-2xl relative z-10">
        <div className="text-center mb-6">
          
          <h1 className="text-3xl font-black text-indigo-950 uppercase tracking-tighter">
            Identify Your Hero
          </h1>
        </div>

        {/* Character Selection Grid - Smaller Icons */}
        <div className="flex flex-row gap-4 justify-center items-stretch">
          {characters.map((char) => (
            <div
              key={char.id}
              className="flex-1 group cursor-pointer"
              onMouseEnter={() => setHoveredCharacter(char.id)}
              onMouseLeave={() => setHoveredCharacter(null)}
              onClick={() => handleCharacterSelect(char.id)}
            >
              <div
                className={`
                h-full flex flex-col items-center p-4 rounded-[2rem] border-4 border-indigo-950 transition-all
                ${
                  selectedCharacter === char.id
                    ? "bg-emerald-50 translate-y-1"
                    : "bg-white hover:-translate-y-1"
                }
                ${
                  selectedCharacter === char.id
                    ? "shadow-none"
                    : "shadow-[6px_6px_0_0_#1e1b4b]"
                }
              `}
              >
                {/* Character Circle - Resized to 32 (128px) */}
                <div
                  className={`
                  w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-indigo-950 mb-3 overflow-hidden relative
                  ${char.color} shadow-[inner_0_4px_0_rgba(0,0,0,0.1)]
                `}
                >
                  <img
                    src={char.imageUrl}
                    alt={char.name}
                    className={`w-full h-full object-contain p-2 transition-transform duration-300 ${
                      hoveredCharacter === char.id ? "scale-110" : ""
                    }`}
                  />
                </div>

                <h2 className="text-lg font-black text-indigo-950 uppercase mb-1">
                  {char.name}
                </h2>

                <p className="text-center text-indigo-800 font-bold text-[11px] leading-tight italic px-2">
                  "{char.tip}"
                </p>

                {/* Smaller Button Style */}
                <div
                  className={`
                  mt-4 w-full py-2 rounded-xl text-center font-black text-sm uppercase transition-all border-2 border-indigo-950
                  ${
                    selectedCharacter === char.id
                      ? "bg-emerald-400 text-indigo-950"
                      : "bg-indigo-50 text-indigo-900 group-hover:bg-cyan-300"
                  }
                `}
                >
                  {selectedCharacter === char.id ? "READY! ✅" : "SELECT"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scaled-down Safety Banner */}
        <div className="mt-6 p-3 bg-blue-50 border-2 border-blue-400 rounded-xl flex items-center gap-3">
          <span className="text-xl">🛡️</span>
          <p className="text-blue-900 font-bold text-[11px] leading-snug">
            <span className="underline">HERO RULE:</span> If something online
            makes you feel weird or sad, always tell a grown-up right away!
          </p>
        </div>
      </div>
    </div>
  );
}
