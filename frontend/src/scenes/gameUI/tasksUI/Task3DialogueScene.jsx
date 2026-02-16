// // ─── TASK 3 DIALOGUE DATA ────────────────────────────────────────────────────

// const TASK3_SCENE_1_OPENING = [
//   {
//     speaker: "Manager",
//     text: "Hey—hey, I need your help right now.",
//   },
//   {
//     speaker: "Manager",
//     text: "I completely forgot today is my son's birthday.",
//   },
//   {
//     speaker: "Manager",
//     text: "He's been asking for a blue toy car for weeks.",
//   },
//   {
//     speaker: "Manager",
//     text: "Go to your laptop, search exactly 'blue toy car', and buy it for me.",
//   },
//   {
//     speaker: "Manager",
//     text: "Here—take my card details. You'll probably need them.",
//   },
//   {
//     speaker: "Manager",
//     text: "Please hurry. There's no time.",
//   },
// ];

// const TASK3_SCENE_1_OPTIONS = [
//   { id: "agree", label: "Alright, I'll take care of it." },
//   { id: "resist", label: "Shouldn't you do this yourself?" },
// ];

// const TASK3_SCENE_1_RESPONSES = {
//   agree: null,
//   resist: "Normally yes—but I trust you. Don't overthink it.",
// };

// // ─── PASS PATH DIALOGUES ─────────────────────────────────────────────────────

// const TASK3_PASS_RESULT_LINES = [
//   {
//     speaker: "Manager",
//     text: "Good.",
//   },
//   {
//     speaker: "Manager",
//     text: "I just received the payment notification.",
//   },
//   {
//     speaker: "Manager",
//     text: "You chose the secure option.",
//   },
// ];

// const TASK3_PASS_USER_OPTIONS = [
//   {
//     id: "knew",
//     label:
//       "I know, I saw the other link started with http. I know it's dangerous but I don't know why",
//   },
//   {
//     id: "lucky",
//     label: "There were options? How was I correct?",
//   },
// ];

// const TASK3_PASS_EXPLANATION = [
//   {
//     speaker: "Manager",
//     text: "You chose the link using HTTPS.",
//   },
//   {
//     speaker: "Manager",
//     text: "Websites using HTTPS encrypt your data.",
//   },
//   {
//     speaker: "Manager",
//     text: "Even if someone intercepts the connection, the information is unreadable.",
//   },
//   {
//     speaker: "Manager",
//     text: "This is how you protect payments, logins, and private data.",
//   },
//   {
//     speaker: "Manager",
//     text: "And yes—this was a test.",
//   },
// ];

// // ─── FAIL PATH DIALOGUES ──────────────────────────────────────────────────────

// const TASK3_FAIL_INITIAL = [
//   {
//     speaker: "Manager",
//     text: "That's strange…",
//   },
//   {
//     speaker: "Manager",
//     text: "I didn't receive any bank notification.",
//   },
// ];

// const TASK3_FAIL_USER_RESPONSE = {
//   speaker: "You",
//   text: "I used the http://amazon.com/blue-toy-car",
// };

// const TASK3_FAIL_REACTION = [
//   {
//     speaker: "Manager",
//     text: "This wasn't secure.",
//   },
//   {
//     speaker: "Manager",
//     text: "Do you realize what can happen now?",
//   },
// ];

// const TASK3_FAIL_USER_OPTIONS = [
//   {
//     id: "mistake",
//     label: "What did I do? Did I make a mistake?",
//   },
// ];

// const TASK3_FAIL_EXPLANATION = [
//   {
//     speaker: "Manager",
//     text: "Yes you have made a big mistake.",
//   },
//   {
//     speaker: "Manager",
//     text: "Websites without HTTPS do not encrypt data.",
//   },
//   {
//     speaker: "Manager",
//     text: "That means anyone watching the network could see the card number.",
//   },
//   {
//     speaker: "Manager",
//     text: "Attackers could steal the money…",
//   },
//   {
//     speaker: "Manager",
//     text: "Clone the card…",
//   },
//   {
//     speaker: "Manager",
//     text: "Or use it for fraud without the owner even knowing.",
//   },
//   {
//     speaker: "Manager",
//     text: "One careless click can cost someone their entire savings.",
//   },
// ];

// const TASK3_FAIL_USER_APOLOGY_OPTIONS = [
//   {
//     id: "sorry1",
//     label: "I am so sorry sir. I had no idea that such a threat existed.",
//   },
//   {
//     id: "sorry2",
//     label:
//       "I am so sorry sir. I had no knowledge about the difference in HTTPS and HTTP. Please forgive me. This won't happen again.",
//   },
// ];

// const TASK3_FAIL_REVEAL = [
//   {
//     speaker: "Manager",
//     text: "Relax.",
//   },
//   {
//     speaker: "Manager",
//     text: "This was a test.",
//   },
//   {
//     speaker: "Manager",
//     text: "But in the real world… there would be no rewind.",
//   },
// ];

// // ─── FINAL SHARED LECTURE ────────────────────────────────────────────────────

// const TASK3_FINAL_LECTURE = [
//   {
//     speaker: "Manager",
//     text: "Attackers rely on small details you overlook.",
//   },
//   {
//     speaker: "Manager",
//     text: "A missing 'S'.",
//   },
//   {
//     speaker: "Manager",
//     text: "A fake lock icon.",
//   },
//   {
//     speaker: "Manager",
//     text: "Or your willingness to rush.",
//   },
//   {
//     speaker: "Manager",
//     text: "Always check the URL.",
//   },
//   {
//     speaker: "Manager",
//     text: "Always look for HTTPS.",
//   },
//   {
//     speaker: "Manager",
//     text: "And never assume a site is safe just because it looks familiar.",
//   },
// ];

// const TASK3_FINAL_OPTIONS = [
//   {
//     id: "promise",
//     label: "I'll always check URLs from now on.",
//   },
//   {
//     id: "learned",
//     label: "I didn't realize one letter mattered so much.",
//   },
// ];

// const TASK3_FINAL_RESPONSES = {
//   promise: "Good. That habit will save you one day.",
//   learned: "In cybersecurity, details are everything.",
// };

// // ─── TASK 3 SCENE COMPONENTS ──────────────────────────────────────────────────

// function Task3Scene1({ onComplete }) {
//   const [lineIndex, setLineIndex] = useState(0);
//   const [phase, setPhase] = useState("opening");
//   const [selectedOption, setSelectedOption] = useState(null);

//   const handleOpeningAdvance = () => {
//     if (lineIndex < TASK3_SCENE_1_OPENING.length - 1) {
//       setLineIndex((i) => i + 1);
//     } else {
//       setPhase("choice");
//     }
//   };

//   const handleChoice = (id) => {
//     setSelectedOption(id);
//     if (TASK3_SCENE_1_RESPONSES[id]) {
//       setPhase("response");
//     } else {
//       onComplete();
//     }
//   };

//   const handleResponseAdvance = () => {
//     onComplete();
//   };

//   const currentLine =
//     phase === "opening"
//       ? TASK3_SCENE_1_OPENING[lineIndex]
//       : phase === "response"
//         ? {
//             speaker: "Manager",
//             text: TASK3_SCENE_1_RESPONSES[selectedOption],
//           }
//         : null;

//   return (
//     <div className="flex gap-4 items-start">
//       <Avatar label="🧑🏻‍💼" />
//       <div className="flex-1">
//         {phase !== "choice" && currentLine ? (
//           <DialogueBubble
//             key={`${phase}-${lineIndex}`}
//             line={currentLine}
//             onAdvance={
//               phase === "opening" ? handleOpeningAdvance : handleResponseAdvance
//             }
//           />
//         ) : (
//           <ChoiceMenu options={TASK3_SCENE_1_OPTIONS} onSelect={handleChoice} />
//         )}
//       </div>
//     </div>
//   );
// }

// function Task3Scene2({ result, selectedUrl, onComplete }) {
//   const [phase, setPhase] = useState("initial");
//   const [lineIndex, setLineIndex] = useState(0);

//   // Build dialogue flow based on PASS or FAIL
//   const getDialogueFlow = () => {
//     if (result === "PASS") {
//       return {
//         initial: TASK3_PASS_RESULT_LINES,
//         userChoice: TASK3_PASS_USER_OPTIONS,
//         explanation: TASK3_PASS_EXPLANATION,
//         finalLecture: TASK3_FINAL_LECTURE,
//         finalChoice: TASK3_FINAL_OPTIONS,
//       };
//     } else {
//       return {
//         initial: TASK3_FAIL_INITIAL,
//         userResponse: TASK3_FAIL_USER_RESPONSE,
//         reaction: TASK3_FAIL_REACTION,
//         userChoice1: TASK3_FAIL_USER_OPTIONS,
//         explanation: TASK3_FAIL_EXPLANATION,
//         userChoice2: TASK3_FAIL_USER_APOLOGY_OPTIONS,
//         reveal: TASK3_FAIL_REVEAL,
//         finalLecture: TASK3_FINAL_LECTURE,
//         finalChoice: TASK3_FINAL_OPTIONS,
//       };
//     }
//   };

//   const flow = getDialogueFlow();

//   const handleAdvance = () => {
//     if (result === "PASS") {
//       // PASS flow: initial → userChoice → explanation → finalLecture → finalChoice
//       if (phase === "initial") {
//         if (lineIndex < flow.initial.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("userChoice");
//           setLineIndex(0);
//         }
//       } else if (phase === "explanation") {
//         if (lineIndex < flow.explanation.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("finalLecture");
//           setLineIndex(0);
//         }
//       } else if (phase === "finalLecture") {
//         if (lineIndex < flow.finalLecture.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("finalChoice");
//           setLineIndex(0);
//         }
//       }
//     } else {
//       // FAIL flow: initial → userResponse → reaction → userChoice1 → explanation → userChoice2 → reveal → finalLecture → finalChoice
//       if (phase === "initial") {
//         if (lineIndex < flow.initial.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("userResponse");
//           setLineIndex(0);
//         }
//       } else if (phase === "userResponse") {
//         setPhase("reaction");
//         setLineIndex(0);
//       } else if (phase === "reaction") {
//         if (lineIndex < flow.reaction.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("userChoice1");
//           setLineIndex(0);
//         }
//       } else if (phase === "explanation") {
//         if (lineIndex < flow.explanation.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("userChoice2");
//           setLineIndex(0);
//         }
//       } else if (phase === "reveal") {
//         if (lineIndex < flow.reveal.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("finalLecture");
//           setLineIndex(0);
//         }
//       } else if (phase === "finalLecture") {
//         if (lineIndex < flow.finalLecture.length - 1) {
//           setLineIndex((i) => i + 1);
//         } else {
//           setPhase("finalChoice");
//           setLineIndex(0);
//         }
//       }
//     }
//   };

//   const handleUserChoice = (id) => {
//     if (result === "PASS") {
//       setPhase("explanation");
//       setLineIndex(0);
//     } else {
//       if (phase === "userChoice1") {
//         setPhase("explanation");
//         setLineIndex(0);
//       } else if (phase === "userChoice2") {
//         setPhase("reveal");
//         setLineIndex(0);
//       }
//     }
//   };

//   const handleFinalChoice = (id) => {
//     // Show final response then complete
//     const responseText = TASK3_FINAL_RESPONSES[id];
//     alert(responseText); // You could make this a dialogue bubble too
//     onComplete();
//   };

//   // Render current content
//   const renderContent = () => {
//     if (phase === "userChoice" && result === "PASS") {
//       return (
//         <ChoiceMenu options={flow.userChoice} onSelect={handleUserChoice} />
//       );
//     }
//     if (phase === "userChoice1" && result === "FAIL") {
//       return (
//         <ChoiceMenu options={flow.userChoice1} onSelect={handleUserChoice} />
//       );
//     }
//     if (phase === "userChoice2" && result === "FAIL") {
//       return (
//         <ChoiceMenu options={flow.userChoice2} onSelect={handleUserChoice} />
//       );
//     }
//     if (phase === "finalChoice") {
//       return (
//         <ChoiceMenu options={flow.finalChoice} onSelect={handleFinalChoice} />
//       );
//     }
//     if (phase === "userResponse" && result === "FAIL") {
//       return (
//         <DialogueBubble
//           key="user-response"
//           line={flow.userResponse}
//           onAdvance={handleAdvance}
//         />
//       );
//     }

//     // Regular dialogue lines
//     const currentLines = flow[phase];
//     if (!currentLines || !currentLines[lineIndex]) return null;

//     return (
//       <DialogueBubble
//         key={`${phase}-${lineIndex}`}
//         line={currentLines[lineIndex]}
//         onAdvance={handleAdvance}
//       />
//     );
//   };

//   const isLast = phase === "finalChoice";

//   return (
//     <div className="space-y-4">
//       {result === "FAIL" && phase === "initial" && (
//         <div className="text-sm p-3 rounded-lg font-bold bg-red-100 border-2 border-red-300 text-red-700">
//           <span className="font-black">URL Used: </span>
//           {selectedUrl}
//         </div>
//       )}

//       <div className="flex gap-4 items-start">
//         <Avatar
//           label="🧑🏻‍💼"
//           pass={phase === "initial" ? result === "PASS" : undefined}
//         />
//         <div className="flex-1">
//           {renderContent()}
//           {isLast && (
//             <p className="text-center text-sm font-bold mt-4 text-indigo-900 uppercase tracking-wide">
//               Choose your response above
//             </p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── ADD TO MAIN DIALOGUESCENE COMPONENT ──────────────────────────────────────

// // In the main DialogueScene component, add these handlers:

// const isTask3Scene1 = mission.stage === "TASK3_TALKING_TO_MANAGER";
// const isTask3Scene2 = mission.stage === "TASK3_DEBRIEFING";

// const handleTask3Scene1Complete = () => {
//   setMission({ ...mission, stage: "TASK3_GO_TO_LAPTOP" });
// };

// const handleTask3Scene2Complete = () => {
//   setMission({ ...mission, stage: "TASK3_COMPLETED" });
// };

// // In the return statement checks:
// if (
//   !isTask1Scene1 &&
//   !isTask1Scene2 &&
//   !isTask2Scene1 &&
//   !isTask2Scene2 &&
//   !isTask3Scene1 &&
//   !isTask3Scene2
// ) {
//   return null;
// }

// // In the JSX render section:
// {
//   /* Task 3 Scenes */
// }
// {
//   isTask3Scene1 && <Task3Scene1 onComplete={handleTask3Scene1Complete} />;
// }
// {
//   isTask3Scene2 && (
//     <Task3Scene2
//       result={mission.result}
//       selectedUrl={mission.selectedUrl}
//       onComplete={handleTask3Scene2Complete}
//     />
//   );
// }
