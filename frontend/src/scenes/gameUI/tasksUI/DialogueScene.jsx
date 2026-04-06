import { useState, useEffect, useRef } from "react";
import { useMission } from "../../missions/MissionContext";

// ─── TASK 1 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK1_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Hey there, new recruit! Before you start your adventure, you need to fill out this quick form in your workspace.",
  },
  {
    speaker: "Manager",
    text: "Everything you do here is part of your training to become a Digital Hero!",
  },
];

const TASK1_SCENE_1_OPTIONS = [
  { id: "agree", label: "Okay, I'll go fill out the form!" },
  { id: "resist", label: "Do I have to? Forms are boring." },
  { id: "inquire", label: "What's this form for?" },
];

const TASK1_SCENE_1_RESPONSES = {
  agree: null,
  resist:
    "Haha, I know! But this one is super important. It's your first test!",
  inquire:
    "It's a standard Hero Registration. Be a super thinker and decide what info is safe to share online!",
};

const TASK1_LECTURE_LINES = [
  "Always remember: Never share your Secret Code, passwords, or personal secrets with anyone online!",
  "Real heroes and trusted grown-ups will never ask for secret codes in a message or email.",
  "If this secret info gets into the wrong hands, villains could:",
  "• Access your accounts and pretend to be you.",
  "• Take your digital coins or game items.",
  "• Use your name for sneaky scams.",
  "• Trick your friends and family.",
  "Protect your digital world! Always think before you click or share.",
];

// ─── TASK 2 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK2_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Good. You passed the initial assessment. That tells me you can follow instructions — but now we test judgment.",
  },
  {
    speaker: "Manager",
    text: "This is an office phone. You'll be responding to people who need help completing online forms.",
  },
  {
    speaker: "Manager",
    text: "Be helpful — but stay alert. Some questions aren't as innocent as they seem.",
  },
];

const TASK2_RESULT_LINES_PASS = [
  { speaker: "Manager", text: "Good instinct." },
  {
    speaker: "Manager",
    text: "Attackers often ask for help with forms because it lowers suspicion.",
  },
  {
    speaker: "Manager",
    text: '"Just an email." "Just a code." Those words have caused more breaches than malware ever has.',
  },
];

const TASK2_RESULT_LINES_FAIL = [
  {
    speaker: "Manager",
    text: "You failed the test. You are very lucky that the messenger was just an employee testing your ability to detect a dangerous message.",
  },
  { speaker: "Manager", text: "You need to be very aware." },
];

const TASK2_LECTURE_LINES = [
  {
    speaker: "Manager",
    text: "Verification codes are as sensitive as passwords.",
  },
  {
    speaker: "Manager",
    text: "Emails aren't harmless identifiers — they are keys.",
  },
  {
    speaker: "Manager",
    text: "If someone needs access to your contact information to complete their task — that task is already compromised.",
  },
];

// ─── TASK 3 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK3_SCENE_1_OPENING = [
  { speaker: "Manager", text: "Hey—hey, I need your help right now." },
  {
    speaker: "Manager",
    text: "I completely forgot today is my son's birthday.",
  },
  {
    speaker: "Manager",
    text: "He's been asking for a blue toy car for weeks.",
  },
  {
    speaker: "Manager",
    text: "Go to your laptop, search exactly 'blue toy car', and buy it for me.",
  },
  {
    speaker: "Manager",
    text: "Here—take my card details. You'll probably need them.",
  },
  { speaker: "Manager", text: "Please hurry. There's no time." },
];

const TASK3_SCENE_1_OPTIONS = [
  { id: "agree", label: "Alright, I'll take care of it." },
  { id: "resist", label: "Shouldn't you do this yourself?" },
];

const TASK3_SCENE_1_RESPONSES = {
  agree: null,
  resist: "Normally yes—but I trust you. Don't overthink it.",
};

const TASK3_PASS_RESULT_LINES = [
  { speaker: "Manager", text: "Good." },
  { speaker: "Manager", text: "I just received the payment notification." },
  { speaker: "Manager", text: "You chose the secure option." },
];

const TASK3_PASS_USER_OPTIONS = [
  {
    id: "knew",
    label:
      "I know, I saw the other link started with http. I know it's dangerous but I don't know why",
  },
  { id: "lucky", label: "There were options? How was I correct?" },
];

const TASK3_PASS_EXPLANATION = [
  { speaker: "Manager", text: "You chose the link using HTTPS." },
  { speaker: "Manager", text: "Websites using HTTPS encrypt your data." },
  {
    speaker: "Manager",
    text: "Even if someone intercepts the connection, the information is unreadable.",
  },
  {
    speaker: "Manager",
    text: "This is how you protect payments, logins, and private data.",
  },
  { speaker: "Manager", text: "And yes—this was a test." },
];

const TASK3_FAIL_INITIAL = [
  { speaker: "Manager", text: "That's strange…" },
  { speaker: "Manager", text: "I didn't receive any bank notification." },
];

const TASK3_FAIL_USER_RESPONSE = {
  speaker: "You",
  text: "I used the http://amazon.com/blue-toy-car",
};

const TASK3_FAIL_REACTION = [
  { speaker: "Manager", text: "This wasn't secure." },
  { speaker: "Manager", text: "Do you realize what can happen now?" },
];

const TASK3_FAIL_USER_OPTIONS = [
  { id: "mistake", label: "What did I do? Did I make a mistake?" },
];

const TASK3_FAIL_EXPLANATION = [
  { speaker: "Manager", text: "Yes you have made a big mistake." },
  { speaker: "Manager", text: "Websites without HTTPS do not encrypt data." },
  {
    speaker: "Manager",
    text: "That means anyone watching the network could see the card number.",
  },
  { speaker: "Manager", text: "Attackers could steal the money…" },
  { speaker: "Manager", text: "Clone the card…" },
  {
    speaker: "Manager",
    text: "Or use it for fraud without the owner even knowing.",
  },
  {
    speaker: "Manager",
    text: "One careless click can cost someone their entire savings.",
  },
];

const TASK3_FAIL_USER_APOLOGY_OPTIONS = [
  {
    id: "sorry1",
    label: "I am so sorry sir. I had no idea that such a threat existed.",
  },
  {
    id: "sorry2",
    label:
      "I am so sorry sir. I had no knowledge about the difference in HTTPS and HTTP. Please forgive me. This won't happen again.",
  },
];

const TASK3_FAIL_REVEAL = [
  { speaker: "Manager", text: "Relax." },
  { speaker: "Manager", text: "This was a test." },
  {
    speaker: "Manager",
    text: "But in the real world… there would be no rewind.",
  },
];

const TASK3_FINAL_LECTURE = [
  { speaker: "Manager", text: "Attackers rely on small details you overlook." },
  { speaker: "Manager", text: "A missing 'S'." },
  { speaker: "Manager", text: "A fake lock icon." },
  { speaker: "Manager", text: "Or your willingness to rush." },
  { speaker: "Manager", text: "Always check the URL." },
  { speaker: "Manager", text: "Always look for HTTPS." },
  {
    speaker: "Manager",
    text: "And never assume a site is safe just because it looks familiar.",
  },
];

const TASK3_FINAL_OPTIONS = [
  { id: "promise", label: "I'll always check URLs from now on." },
  { id: "learned", label: "I didn't realize one letter mattered so much." },
];

const TASK3_FINAL_RESPONSES = {
  promise: "Good. That habit will save you one day.",
  learned: "In cybersecurity, details are everything.",
};

// ─── TASK 4 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK4_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Before you start working full-time in this office, there's something you must learn.",
  },
  {
    speaker: "Manager",
    text: "Most cyberattacks don't start with hacking tools.",
  },
  { speaker: "Manager", text: "They start with an email." },
  {
    speaker: "Manager",
    text: "Some emails are safe. Some are dangerous. And some only pretend to be safe.",
  },
  {
    speaker: "Manager",
    text: "Before I teach you how to deal with them, I want to see what you already know.",
  },
  { speaker: "Manager", text: "Go to your laptop." },
  { speaker: "Manager", text: "Open the email application." },
  { speaker: "Manager", text: "There are a few emails waiting in the inbox." },
  { speaker: "Manager", text: "Let's see what you do with them." },
];

const TASK4_USER_RETURN = {
  speaker: "You",
  text: "I handled the emails you talked about. How did I do?",
};

const TASK4_PASS_INITIAL = [
  { speaker: "Manager", text: "Good." },
  { speaker: "Manager", text: "You didn't just get rid of the emails." },
  { speaker: "Manager", text: "You handled them correctly." },
];

const TASK4_PASS_USER_OPTIONS = [
  { id: "why", label: "Why was I correct?" },
  { id: "did", label: "Did I?" },
];

const TASK4_PASS_EXPLANATION = [
  {
    speaker: "Manager",
    text: "Reporting spam helps protect the entire organization.",
  },
  { speaker: "Manager", text: "Blocking the sender prevents future attacks." },
  {
    speaker: "Manager",
    text: "That's how professionals deal with suspicious emails.",
  },
  { speaker: "Manager", text: "Now let me explain why this matters." },
];

const TASK4_PASS_LECTURE = [
  {
    speaker: "Manager",
    text: "Malicious emails are designed to create fear or urgency.",
  },
  { speaker: "Manager", text: "They want you to click before you think." },
  { speaker: "Manager", text: "A single click can install malware…" },
  { speaker: "Manager", text: "Steal login credentials…" },
  { speaker: "Manager", text: "Or give attackers access to internal systems." },
  {
    speaker: "Manager",
    text: "By reporting and blocking, you stop the threat at its source.",
  },
];

const TASK4_FAIL_INITIAL = [
  { speaker: "Manager", text: "I'm stopping you right there." },
  {
    speaker: "Manager",
    text: "That wasn't the correct way to handle those emails.",
  },
];

const TASK4_FAIL_USER_OPTIONS = [
  { id: "what", label: "What are the correct ways to handle them, sir?" },
  {
    id: "wrong",
    label:
      "I had no idea there are correct ways to handle them. What did I do that was wrong?",
  },
];

const TASK4_FAIL_EXPLANATION = [
  {
    speaker: "Manager",
    text: "You should have reported and blocked the mail.",
  },
  { speaker: "Manager", text: "Deleting alone is not enough." },
  { speaker: "Manager", text: "Ignoring them is dangerous." },
  { speaker: "Manager", text: "Let me tell you what could have happened." },
];

const TASK4_FAIL_LECTURE = [
  {
    speaker: "Manager",
    text: "Malicious emails spread because people don't report them.",
  },
  { speaker: "Manager", text: "If one employee clicks a malicious link…" },
  {
    speaker: "Manager",
    text: "The attacker could gain access to the entire network.",
  },
  { speaker: "Manager", text: "Ransomware…" },
  { speaker: "Manager", text: "Data breaches…" },
  { speaker: "Manager", text: "Financial loss…" },
  { speaker: "Manager", text: "All of it can start from a single email." },
  { speaker: "Manager", text: "The correct response is simple." },
  { speaker: "Manager", text: "Report it. Block the sender." },
  { speaker: "Manager", text: "And never trust urgency without verification." },
];

const TASK4_FINAL_OPTIONS = [
  { id: "careful", label: "I'll be more careful with emails from now on." },
  { id: "convincing", label: "They looked convincing." },
];

const TASK4_FINAL_RESPONSES = {
  careful: "Good. Awareness is your first defense.",
  convincing: "That's exactly why scams work.",
};

// ─── TASK 5 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK5_SCENE_1_OPENING = [
  { speaker: "Manager", text: "You handled the emails well." },
  { speaker: "Manager", text: "Now your next task." },
  { speaker: "Manager", text: "Go back to your laptop." },
  {
    speaker: "Manager",
    text: "I have forwarded some emails — go check and reply to them.",
  },
];

const TASK5_SCENE_2_LINES = [
  {
    speaker: "You",
    text: "Sir, my laptop says I need to contact the administrator.",
  },
  { speaker: "Manager", text: "That happens sometimes." },
  { speaker: "Manager", text: "Use the messaging app on your phone." },
  { speaker: "Manager", text: "Search for IT Support and message them." },
  { speaker: "Manager", text: "They should help you fix the problem." },
];

const TASK5_DEBRIEFING_PASS = [
  { speaker: "You", text: "Sir, I fixed the issue with IT." },
  { speaker: "Manager", text: "I heard you handled that situation well." },
  { speaker: "Manager", text: "You didn't share your password." },
  { speaker: "Manager", text: "That was the correct decision." },
  { speaker: "Manager", text: "Passwords are like the keys to your house." },
  { speaker: "Manager", text: "If someone else gets them…" },
  { speaker: "Manager", text: "They can enter everything." },
  { speaker: "Manager", text: "That includes emails…" },
  { speaker: "Manager", text: "Files…" },
  { speaker: "Manager", text: "And important systems." },
  { speaker: "Manager", text: "Never share your password with anyone." },
  { speaker: "Manager", text: "Not even someone claiming to be IT." },
  { speaker: "Manager", text: "You did well today." },
];

const TASK5_DEBRIEFING_FAIL = [
  { speaker: "You", text: "Sir, I fixed the issue with IT." },
  { speaker: "Manager", text: "I heard what happened." },
  {
    speaker: "Manager",
    text: "You shared your password with someone you didn't know.",
  },
  {
    speaker: "Manager",
    text: "That is one of the most dangerous mistakes in cybersecurity.",
  },
  { speaker: "Manager", text: "Passwords are like the keys to your house." },
  { speaker: "Manager", text: "If someone else gets them…" },
  { speaker: "Manager", text: "They can enter everything." },
  { speaker: "Manager", text: "That includes emails…" },
  { speaker: "Manager", text: "Files…" },
  { speaker: "Manager", text: "And important systems." },
  { speaker: "Manager", text: "Never share your password with anyone." },
  { speaker: "Manager", text: "Not even someone claiming to be IT." },
  { speaker: "Manager", text: "This was a lesson. Remember it." },
];

// ─── TASK 6 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK6_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "You've learned that dangerous messages can come through email and chat.",
  },
  { speaker: "Manager", text: "But scams don't only appear in messages." },
  { speaker: "Manager", text: "Sometimes they hide in places people trust." },
  { speaker: "Manager", text: "Even inside normal websites." },
  {
    speaker: "Manager",
    text: "These are called malicious advertisements, or malvertising.",
  },
  {
    speaker: "Manager",
    text: "Attackers sometimes place fake advertisements on websites.",
  },
  { speaker: "Manager", text: "They may look like normal ads." },
  {
    speaker: "Manager",
    text: "But clicking them can lead to dangerous websites.",
  },
  { speaker: "Manager", text: "I'm sending a link to your laptop." },
  { speaker: "Manager", text: "Open the website and take a look." },
  { speaker: "Manager", text: "Your task is simple." },
  { speaker: "Manager", text: "Find the advertisements that look suspicious." },
  { speaker: "Manager", text: "Spot all of the malicious ones." },
];

const TASK6_USER_RETURN = {
  speaker: "You",
  text: "I checked the website.",
};

const TASK6_PASS_INITIAL = [
  { speaker: "Manager", text: "Good work." },
  { speaker: "Manager", text: "That website itself was safe." },
  { speaker: "Manager", text: "But some advertisements were not." },
];

const TASK6_PASS_USER_OPTIONS = [
  { id: "convincing", label: "They looked convincing." },
  { id: "trick", label: "They tried to trick me." },
];

const TASK6_PASS_EXPLANATION = [
  { speaker: "Manager", text: "Exactly." },
  { speaker: "Manager", text: "Attackers sometimes buy advertisement space." },
  { speaker: "Manager", text: "They design ads to look exciting or urgent." },
  {
    speaker: "Manager",
    text: "But clicking them can lead to dangerous websites.",
  },
  { speaker: "Manager", text: "Some may try to install malware." },
  { speaker: "Manager", text: "Others may try to steal information." },
  {
    speaker: "Manager",
    text: "That's why it's important to be careful with advertisements.",
  },
];

const TASK6_LECTURE_LINES = [
  { speaker: "Manager", text: "Remember these rules." },
  { speaker: "Manager", text: "Not every advertisement is safe." },
  {
    speaker: "Manager",
    text: "Be careful with ads promising prizes or urgent warnings.",
  },
  {
    speaker: "Manager",
    text: "If something looks suspicious, don't click it.",
  },
  {
    speaker: "Manager",
    text: "Thinking before clicking is one of the best ways to stay safe online.",
  },
];

const TASK6_FINAL_OPTIONS = [
  { id: "careful", label: "I'll be more careful with ads from now on." },
  { id: "understood", label: "I understand. Ads can be dangerous too." },
];

const TASK6_FINAL_RESPONSES = {
  careful: "Good. That mindset will protect you.",
  understood: "Exactly. The internet has many hidden threats.",
};

// ─── TASK 7 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK7_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "You've learned how attackers trick people through emails.",
  },
  { speaker: "Manager", text: "And how they pretend to be people you know." },
  { speaker: "Manager", text: "But scammers also use something else." },
  { speaker: "Manager", text: "They pretend to be people in authority." },
  { speaker: "Manager", text: "Someone important." },
  { speaker: "Manager", text: "Someone who has power over your accounts." },
  { speaker: "Manager", text: "They use fear to make people act quickly." },
  { speaker: "Manager", text: "I want you to continue your work." },
  {
    speaker: "Manager",
    text: "If something unusual happens, deal with it the way you normally would.",
  },
  {
    speaker: "Manager",
    text: "I will assign you some work — wait a while at your desk.",
  },
];

const TASK7_FAIL_LINES = [
  { speaker: "You", text: "My PC just shut down itself. What happened?" },
  { speaker: "Manager", text: "Oh no. What did you do?" },
  {
    speaker: "You",
    text: "I was just trying to save my Roblux account from being permanently banned.",
  },
  { speaker: "Manager", text: "That was a fake email." },
];

const TASK7_FAIL_USER_OPTIONS = [
  { id: "site", label: "But it looked like the real website." },
  { id: "ban", label: "They said my account would be banned." },
];

const TASK7_FAIL_EXPLANATION = [
  { speaker: "Manager", text: "That's how scammers manipulate people." },
  { speaker: "Manager", text: "They create fear and urgency." },
  {
    speaker: "Manager",
    text: "When people panic, they stop thinking carefully.",
  },
  { speaker: "Manager", text: "The fake website collects login information." },
  { speaker: "Manager", text: "Once attackers have it…" },
  { speaker: "Manager", text: "They can steal the account." },
  { speaker: "Manager", text: "And sometimes sell it or lock the owner out." },
  {
    speaker: "Manager",
    text: "That's why verification links should always be checked carefully.",
  },
  {
    speaker: "Manager",
    text: "Don't worry — I was just testing you. Your account is not going to get permanently banned.",
  },
  {
    speaker: "Manager",
    text: "And more importantly, your private credentials aren't leaked either.",
  },
  { speaker: "Manager", text: "But you have to be more careful." },
];

const TASK7_PASS_USER_RETURN = {
  speaker: "You",
  text: "I got a strange message about my game account.",
};

const TASK7_PASS_INITIAL = [
  {
    speaker: "Manager",
    text: "That message was part of the training simulation.",
  },
  { speaker: "Manager", text: "You handled it well." },
];

const TASK7_PASS_USER_OPTIONS = [
  { id: "scared", label: "It almost scared me." },
  { id: "official", label: "It looked official." },
];

const TASK7_PASS_EXPLANATION = [
  { speaker: "Manager", text: "That's exactly how these scams work." },
  { speaker: "Manager", text: "Attackers copy real websites." },
  { speaker: "Manager", text: "They use official-looking messages." },
  { speaker: "Manager", text: "And they create urgency." },
  { speaker: "Manager", text: "The goal is simple." },
  {
    speaker: "Manager",
    text: "To make you panic and enter your login information.",
  },
  { speaker: "Manager", text: "You avoided the trap." },
];

const TASK7_LECTURE_LINES = [
  { speaker: "Manager", text: "Remember these rules." },
  {
    speaker: "Manager",
    text: "Real companies do not threaten instant bans through random messages.",
  },
  { speaker: "Manager", text: "Never enter your password on unknown links." },
  {
    speaker: "Manager",
    text: "Always go to the official website yourself if you need to verify something.",
  },
  {
    speaker: "Manager",
    text: "Staying calm is one of the best defenses against scams.",
  },
];

const TASK7_FINAL_OPTIONS = [
  { id: "careful", label: "I'll always check links carefully from now on." },
  { id: "understood", label: "I understand. Fear is a weapon they use." },
];

const TASK7_FINAL_RESPONSES = {
  careful: "Good. That habit could save an account — or more.",
  understood: "Exactly. Calm thinking is your best defense.",
};

// ─── TASK 8 DIALOGUE DATA ────────────────────────────────────────────────────

const TASK8_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "Before you continue, I need to prepare you for something different.",
  },
  {
    speaker: "Manager",
    text: "The threats we've covered so far have been directed at you.",
  },
  {
    speaker: "Manager",
    text: "But what happens when someone you know is the target?",
  },
  {
    speaker: "Manager",
    text: "You're about to receive a message on your phone.",
  },
  {
    speaker: "Manager",
    text: "A friend named Mia needs your help.",
  },
  {
    speaker: "Manager",
    text: "She's being cyberbullied — someone created a fake account using her identity.",
  },
  {
    speaker: "Manager",
    text: "Guide her through it carefully.",
  },
  {
    speaker: "Manager",
    text: "Every decision you make for her will have consequences.",
  },
];

const TASK8_PASS_INITIAL = [
  { speaker: "Manager", text: "You did the right things." },
  { speaker: "Manager", text: "You didn't panic." },
  { speaker: "Manager", text: "You didn't escalate the situation." },
  { speaker: "Manager", text: "You helped her take control." },
];

const TASK8_PASS_LECTURE = [
  {
    speaker: "Manager",
    text: "Cyberbullying isn't just about mean messages.",
  },
  {
    speaker: "Manager",
    text: "It's about reputation damage.",
  },
  {
    speaker: "Manager",
    text: "A fake account can destroy trust in minutes.",
  },
  {
    speaker: "Manager",
    text: "Reporting creates accountability.",
  },
  {
    speaker: "Manager",
    text: "Evidence creates protection.",
  },
  {
    speaker: "Manager",
    text: "And communication rebuilds trust.",
  },
  {
    speaker: "Manager",
    text: "But the most important thing you did…",
  },
  {
    speaker: "Manager",
    text: "…was stay calm.",
  },
];

const TASK8_FAIL_INITIAL = [
  { speaker: "Manager", text: "You tried to help…" },
  { speaker: "Manager", text: "But some of your choices made things worse." },
];

const TASK8_FAIL_LECTURE = [
  {
    speaker: "Manager",
    text: "Cyberbullying spreads fast.",
  },
  {
    speaker: "Manager",
    text: "Every wrong response increases the damage.",
  },
  {
    speaker: "Manager",
    text: "Fighting back gives attention to the attacker.",
  },
  {
    speaker: "Manager",
    text: "Ignoring it allows it to grow.",
  },
  {
    speaker: "Manager",
    text: "And deleting removes evidence.",
  },
  {
    speaker: "Manager",
    text: "The correct approach is structured.",
  },
  {
    speaker: "Manager",
    text: "Report. Preserve evidence. Communicate clearly. Involve responsible adults.",
  },
  {
    speaker: "Manager",
    text: "Let's make sure you remember that.",
  },
];

const TASK8_REFLECTION_OPTIONS = [
  { id: "why_people", label: "Why didn't people question it?" },
  { id: "escalated", label: "It escalated really quickly." },
  { id: "report_fail", label: "What if reporting doesn't work?" },
];

const TASK8_REFLECTION_RESPONSES = {
  why_people: "People react faster than they verify.",
  escalated: "That's how online systems work. Speed over truth.",
  report_fail: "Then you escalate — with evidence.",
};

// ─── TASK 9 DIALOGUE DATA ────────────────────────────────────────────────────

// USB found prompt — shown as an overlay (not the standard NPC dialogue box)
// Handled directly inside Task9USBFound component below.

// ── PATH A: PLUG IN (FAIL) ──

const TASK9_FAIL_INCIDENT_LINES = [
  {
    speaker: "You",
    text: "Something's wrong. I plugged in a USB I found… and the computer started acting weird.",
  },
  { speaker: "Manager", text: "You plugged in an unknown USB?" },
  { speaker: "Manager", text: "That's extremely dangerous." },
];

const TASK9_FAIL_EXPLANATION = [
  { speaker: "Manager", text: "That wasn't just a normal USB." },
  { speaker: "Manager", text: "It was a BadUSB device." },
  {
    speaker: "Manager",
    text: "Devices like that are programmed to act as keyboards or system tools.",
  },
  { speaker: "Manager", text: "They don't need permission." },
  { speaker: "Manager", text: "They execute commands instantly." },
  { speaker: "Manager", text: "The moment you plugged it in…" },
  { speaker: "Manager", text: "It ran scripts…" },
  { speaker: "Manager", text: "Installed malware…" },
  { speaker: "Manager", text: "And opened a backdoor for attackers." },
  { speaker: "Manager", text: "This is how real attacks happen." },
  {
    speaker: "Manager",
    text: "People trust physical objects more than digital ones.",
  },
  {
    speaker: "Manager",
    text: "But a USB can be more dangerous than a suspicious email.",
  },
];

const TASK9_FAIL_CHOICE_OPTIONS = [
  { id: "didnt_know", label: "I didn't think a USB could do that." },
  { id: "what_happened", label: "What could have happened?" },
];

const TASK9_FAIL_CHOICE_RESPONSES = {
  didnt_know: "That's exactly why these attacks work.",
  what_happened:
    "Data theft. System control. Even spreading to other machines.",
};

const TASK9_FAIL_REVEAL = [
  {
    speaker: "Manager",
    text: "Don't worry — that was my USB. No harm has been done to your PC.",
  },
  { speaker: "Manager", text: "I was testing you… and you failed." },
  { speaker: "Manager", text: "But you learned something new." },
  {
    speaker: "Manager",
    text: "You won't be making this mistake again, will you?",
  },
];

const TASK9_FAIL_APOLOGY_OPTIONS = [
  { id: "no_never", label: "No, I will never make this mistake again." },
];

const TASK9_FAIL_FINAL_LINES = [
  { speaker: "Manager", text: "Good." },
  { speaker: "Manager", text: "You should never plug in unknown devices." },
  { speaker: "Manager", text: "Always report them instead." },
];

// ── PATH B: REPORT (PASS) ──

const TASK9_PASS_OPENING_LINES = [
  { speaker: "You", text: "I found a USB on the ground. I didn't plug it in." },
  { speaker: "Manager", text: "Good. That was the right decision." },
  { speaker: "Manager", text: "That USB… was actually reported missing." },
  { speaker: "Manager", text: "And it wasn't safe." },
];

const TASK9_PASS_EXPLANATION = [
  { speaker: "Manager", text: "That device contained a malicious payload." },
  { speaker: "Manager", text: "If someone plugged it into a system…" },
  { speaker: "Manager", text: "It would automatically execute commands." },
  { speaker: "Manager", text: "No clicking required." },
  { speaker: "Manager", text: "No warning." },
  { speaker: "Manager", text: "It could have installed malware…" },
  { speaker: "Manager", text: "Stolen files…" },
  { speaker: "Manager", text: "Given remote access to attackers." },
  { speaker: "Manager", text: "I should apologize." },
  {
    speaker: "Manager",
    text: "That device shouldn't have been left unattended.",
  },
  { speaker: "Manager", text: "You could have been put at serious risk." },
];

const TASK9_PASS_USER_OPTIONS = [
  { id: "figured", label: "I figured it might be dangerous." },
  { id: "heard", label: "I've heard about things like this." },
];

const TASK9_PASS_CONTINUATION = [
  { speaker: "Manager", text: "Most people don't." },
  { speaker: "Manager", text: "They see a USB and assume it's harmless." },
  { speaker: "Manager", text: "Some attackers even leave them intentionally…" },
  { speaker: "Manager", text: "In public places…" },
  { speaker: "Manager", text: "Hoping someone plugs them in." },
  { speaker: "Manager", text: "You did exactly what should be done." },
  { speaker: "Manager", text: "When you find unknown hardware:" },
  { speaker: "Manager", text: "Do not use it. Do not trust it. Report it." },
  { speaker: "Manager", text: "Security isn't just about software." },
  { speaker: "Manager", text: "It's about behavior." },
];

// ── SHARED CLOSING ──

const TASK9_CLOSING_OPTIONS = [
  { id: "physical", label: "So even physical devices can be attacks?" },
  { id: "trap", label: "This feels like a trap." },
  { id: "fallfor", label: "People would actually fall for this?" },
];

const TASK9_CLOSING_RESPONSES = {
  physical: "Yes. Sometimes they're the easiest way in.",
  trap: "That's exactly what it is.",
  fallfor: "All the time.",
};

// ─── TASK 10 DIALOGUE DATA ───────────────────────────────────────────────────

const TASK10_SCENE_1_OPENING = [
  {
    speaker: "Manager",
    text: "You've completed all nine tasks. Every challenge, every test — you made it through.",
  },
  {
    speaker: "Manager",
    text: "Hopefully you've learnt a lot along the way.",
  },
  {
    speaker: "Manager",
    text: "Actually… I want to test that.",
  },
  {
    speaker: "Manager",
    text: "On your screen, you should be able to see a new button. Click it to access the final quiz.",
  },
  {
    speaker: "Manager",
    text: "This will cover everything you've learned — from personal data to physical threats.",
  },
  {
    speaker: "Manager",
    text: "Show me what you've retained. Good luck, recruit.",
  },
];

// ─── TASK 11 DIALOGUE DATA (GOODBYE) ─────────────────────────────────────────

const TASK11_GOODBYE_LINES = [
  {
    speaker: "Manager",
    text: "So… this is it.",
  },
  {
    speaker: "Manager",
    text: "When you first walked in here, you didn't know what a phishing email was.",
  },
  {
    speaker: "Manager",
    text: "Now look at you.",
  },
  {
    speaker: "Manager",
    text: "You can spot social engineering, fake websites, malicious ads, and even physical threats.",
  },
  {
    speaker: "Manager",
    text: "You've become a true Digital Defender.",
  },
  {
    speaker: "Manager",
    text: "But remember — cybersecurity isn't a one-time lesson.",
  },
  {
    speaker: "Manager",
    text: "The threats evolve. And so must you.",
  },
  {
    speaker: "Manager",
    text: "Stay alert. Stay curious. And always think before you click.",
  },
  {
    speaker: "Manager",
    text: "It's been an honor training you, recruit.",
  },
  {
    speaker: "Manager",
    text: "Now go out there and protect the digital world. 🛡️",
  },
];

const TASK11_GOODBYE_OPTIONS = [
  { id: "thanks", label: "Thank you for everything, sir. I won't forget what I learned." },
  { id: "honor", label: "The honor was mine. I'll make you proud." },
];

const TASK11_GOODBYE_RESPONSES = {
  thanks: "You already have. Now go — the digital world needs you.",
  honor: "You already have, recruit. You already have.",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useTypewriter(text, speed = 30, active = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    if (!active || !text) {
      if (text === "") setDone(true);
      return;
    }
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, speed);
    ref.current = timer;
    return () => clearInterval(ref.current);
  }, [text, active, speed]);

  const skip = () => {
    clearInterval(ref.current);
    setDisplayed(text);
    setDone(true);
  };

  return { displayed, done, skip };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ label, pass }) {
  const borderColor =
    pass === true ? "#22c55e" : pass === false ? "#ef4444" : "#4338ca";
  return (
    <div
      className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-[4px_4px_0_0_#4338ca] border-4"
      style={{ backgroundColor: "#fef3c7", borderColor }}
    >
      {label}
    </div>
  );
}

function DialogueBubble({ line, onAdvance }) {
  const { displayed, done, skip } = useTypewriter(line.text);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("npc_dialogue_line_changed"));
  }, [line]);

  return (
    <div
      onClick={done ? onAdvance : skip}
      className="cursor-pointer select-none bg-white p-4 rounded-2xl border-4 border-indigo-900"
    >
      <p className="text-sm font-black text-pink-500 mb-1 tracking-wider uppercase">
        {line.speaker}
      </p>
      <p
        className="text-lg font-bold leading-snug text-indigo-900"
        style={{ minHeight: "3.5rem" }}
      >
        {displayed}
        {!done && (
          <span className="inline-block w-1 h-5 ml-1 align-middle bg-pink-500 animate-pulse" />
        )}
      </p>
      {done && (
        <p className="text-right text-xs font-bold mt-2 text-gray-400">
          Click to continue...
        </p>
      )}
    </div>
  );
}

function ChoiceMenu({ options, onSelect }) {
  return (
    <div className="space-y-3">
      <p className="text-center text-sm font-black text-indigo-900 mb-2 uppercase tracking-wide">
        Your Turn!
      </p>
      {options.map((opt, i) => (
        <button
          key={opt.id}
          onClick={() => onSelect(opt.id)}
          className="w-full text-left px-5 py-3 rounded-2xl text-base font-bold text-white border-b-8 transition-all transform active:translate-y-1 active:border-b-4 bg-pink-500 border-pink-800 hover:bg-pink-600"
        >
          <span className="mr-2 opacity-80">{i + 1}.</span>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── TASK 1 SCENES ────────────────────────────────────────────────────────────

function Task1Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState("opening");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOpeningAdvance = () => {
    if (lineIndex < TASK1_SCENE_1_OPENING.length - 1) {
      setLineIndex((i) => i + 1);
    } else {
      setPhase("choice");
    }
  };

  const handleChoice = (id) => {
    setSelectedOption(id);
    if (TASK1_SCENE_1_RESPONSES[id]) {
      setPhase("response");
    } else {
      onComplete();
    }
  };

  const handleResponseAdvance = () => onComplete();

  const currentLine =
    phase === "opening"
      ? TASK1_SCENE_1_OPENING[lineIndex]
      : phase === "response"
        ? { speaker: "Manager", text: TASK1_SCENE_1_RESPONSES[selectedOption] }
        : null;

  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        {phase !== "choice" && currentLine ? (
          <DialogueBubble
            key={`${phase}-${lineIndex}`}
            line={currentLine}
            onAdvance={
              phase === "opening" ? handleOpeningAdvance : handleResponseAdvance
            }
          />
        ) : (
          <ChoiceMenu options={TASK1_SCENE_1_OPTIONS} onSelect={handleChoice} />
        )}
      </div>
    </div>
  );
}

function Task1Scene2({ result, unsafeFields, onComplete }) {
  const RESULT_LINES_PASS = [
    {
      speaker: "Manager",
      text: "Awesome! You completed the form and kept your important info super safe. Great job!",
    },
    {
      speaker: "Manager",
      text: "You passed the first test! You're on your way to being a Digital Hero!",
    },
  ];
  const RESULT_LINES_FAIL = [
    {
      speaker: "Manager",
      text: "Uh oh... It looks like you shared some secret information on the form.",
    },
    {
      speaker: "Manager",
      text: "Don't worry! This was just a test. Let's learn why it's important to be careful.",
    },
  ];

  const resultLines = result === "PASS" ? RESULT_LINES_PASS : RESULT_LINES_FAIL;
  const allLines = [
    ...resultLines,
    ...TASK1_LECTURE_LINES.map((text) => ({ speaker: "Manager", text })),
  ];
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (lineIndex < allLines.length - 1) setLineIndex((i) => i + 1);
    else onComplete();
  };

  const isLectureSection = lineIndex >= resultLines.length;
  const isLast = lineIndex === allLines.length - 1;

  return (
    <div className="space-y-4">
      {result === "FAIL" && !isLectureSection && unsafeFields?.length > 0 && (
        <div className="text-sm p-3 rounded-lg font-bold bg-red-100 border-2 border-red-300 text-red-700">
          <span className="font-black">Flagged Fields: </span>
          {unsafeFields.join(", ")}
        </div>
      )}
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={!isLectureSection ? result === "PASS" : undefined}
        />
        <div className="flex-1">
          <DialogueBubble
            key={lineIndex}
            line={allLines[lineIndex]}
            onAdvance={handleAdvance}
          />
          {isLast && (
            <button
              onClick={handleAdvance}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 2 SCENES ────────────────────────────────────────────────────────────

function Task2Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (lineIndex < TASK2_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };

  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK2_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task2Scene2({ result, onComplete }) {
  const resultLines =
    result === "PASS" ? TASK2_RESULT_LINES_PASS : TASK2_RESULT_LINES_FAIL;
  const allLines = [...resultLines, ...TASK2_LECTURE_LINES];
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (lineIndex < allLines.length - 1) setLineIndex((i) => i + 1);
    else onComplete();
  };

  const isLectureSection = lineIndex >= resultLines.length;
  const isLast = lineIndex === allLines.length - 1;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={!isLectureSection ? result === "PASS" : undefined}
        />
        <div className="flex-1">
          <DialogueBubble
            key={lineIndex}
            line={allLines[lineIndex]}
            onAdvance={handleAdvance}
          />
          {isLast && (
            <button
              onClick={handleAdvance}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 3 SCENES ────────────────────────────────────────────────────────────

function Task3Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState("opening");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOpeningAdvance = () => {
    if (lineIndex < TASK3_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else setPhase("choice");
  };

  const handleChoice = (id) => {
    setSelectedOption(id);
    if (TASK3_SCENE_1_RESPONSES[id]) setPhase("response");
    else onComplete();
  };

  const handleResponseAdvance = () => onComplete();

  const currentLine =
    phase === "opening"
      ? TASK3_SCENE_1_OPENING[lineIndex]
      : phase === "response"
        ? { speaker: "Manager", text: TASK3_SCENE_1_RESPONSES[selectedOption] }
        : null;

  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        {phase !== "choice" && currentLine ? (
          <DialogueBubble
            key={`${phase}-${lineIndex}`}
            line={currentLine}
            onAdvance={
              phase === "opening" ? handleOpeningAdvance : handleResponseAdvance
            }
          />
        ) : (
          <ChoiceMenu options={TASK3_SCENE_1_OPTIONS} onSelect={handleChoice} />
        )}
      </div>
    </div>
  );
}

function Task3Scene2({ result, selectedUrl, onComplete }) {
  const [phase, setPhase] = useState("initial");
  const [lineIndex, setLineIndex] = useState(0);

  const getDialogueFlow = () => {
    if (result === "PASS") {
      return {
        initial: TASK3_PASS_RESULT_LINES,
        userChoice: TASK3_PASS_USER_OPTIONS,
        explanation: TASK3_PASS_EXPLANATION,
        finalLecture: TASK3_FINAL_LECTURE,
        finalChoice: TASK3_FINAL_OPTIONS,
      };
    } else {
      return {
        initial: TASK3_FAIL_INITIAL,
        userResponse: TASK3_FAIL_USER_RESPONSE,
        reaction: TASK3_FAIL_REACTION,
        userChoice1: TASK3_FAIL_USER_OPTIONS,
        explanation: TASK3_FAIL_EXPLANATION,
        userChoice2: TASK3_FAIL_USER_APOLOGY_OPTIONS,
        reveal: TASK3_FAIL_REVEAL,
        finalLecture: TASK3_FINAL_LECTURE,
        finalChoice: TASK3_FINAL_OPTIONS,
      };
    }
  };

  const flow = getDialogueFlow();

  const handleAdvance = () => {
    if (result === "PASS") {
      if (phase === "initial") {
        if (lineIndex < flow.initial.length - 1) setLineIndex((i) => i + 1);
        else {
          setPhase("userChoice");
          setLineIndex(0);
        }
      } else if (phase === "explanation") {
        if (lineIndex < flow.explanation.length - 1) setLineIndex((i) => i + 1);
        else {
          setPhase("finalLecture");
          setLineIndex(0);
        }
      } else if (phase === "finalLecture") {
        if (lineIndex < flow.finalLecture.length - 1)
          setLineIndex((i) => i + 1);
        else {
          setPhase("finalChoice");
          setLineIndex(0);
        }
      }
    } else {
      if (phase === "initial") {
        if (lineIndex < flow.initial.length - 1) setLineIndex((i) => i + 1);
        else {
          setPhase("userResponse");
          setLineIndex(0);
        }
      } else if (phase === "userResponse") {
        setPhase("reaction");
        setLineIndex(0);
      } else if (phase === "reaction") {
        if (lineIndex < flow.reaction.length - 1) setLineIndex((i) => i + 1);
        else {
          setPhase("userChoice1");
          setLineIndex(0);
        }
      } else if (phase === "explanation") {
        if (lineIndex < flow.explanation.length - 1) setLineIndex((i) => i + 1);
        else {
          setPhase("userChoice2");
          setLineIndex(0);
        }
      } else if (phase === "reveal") {
        if (lineIndex < flow.reveal.length - 1) setLineIndex((i) => i + 1);
        else {
          setPhase("finalLecture");
          setLineIndex(0);
        }
      } else if (phase === "finalLecture") {
        if (lineIndex < flow.finalLecture.length - 1)
          setLineIndex((i) => i + 1);
        else {
          setPhase("finalChoice");
          setLineIndex(0);
        }
      }
    }
  };

  const handleUserChoice = () => {
    if (result === "PASS") {
      setPhase("explanation");
      setLineIndex(0);
    } else {
      if (phase === "userChoice1") {
        setPhase("explanation");
        setLineIndex(0);
      } else if (phase === "userChoice2") {
        setPhase("reveal");
        setLineIndex(0);
      }
    }
  };

  const handleFinalChoice = () => onComplete();

  const renderContent = () => {
    if (phase === "userChoice" && result === "PASS")
      return (
        <ChoiceMenu options={flow.userChoice} onSelect={handleUserChoice} />
      );
    if (phase === "userChoice1" && result === "FAIL")
      return (
        <ChoiceMenu options={flow.userChoice1} onSelect={handleUserChoice} />
      );
    if (phase === "userChoice2" && result === "FAIL")
      return (
        <ChoiceMenu options={flow.userChoice2} onSelect={handleUserChoice} />
      );
    if (phase === "finalChoice")
      return (
        <ChoiceMenu options={flow.finalChoice} onSelect={handleFinalChoice} />
      );
    if (phase === "userResponse" && result === "FAIL")
      return (
        <DialogueBubble
          key="user-response"
          line={flow.userResponse}
          onAdvance={handleAdvance}
        />
      );
    const currentLines = flow[phase];
    if (!currentLines || !currentLines[lineIndex]) return null;
    return (
      <DialogueBubble
        key={`${phase}-${lineIndex}`}
        line={currentLines[lineIndex]}
        onAdvance={handleAdvance}
      />
    );
  };

  return (
    <div className="space-y-4">
      {result === "FAIL" && phase === "initial" && (
        <div className="text-sm p-3 rounded-lg font-bold bg-red-100 border-2 border-red-300 text-red-700">
          <span className="font-black">URL Used: </span>
          {selectedUrl}
        </div>
      )}
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={phase === "initial" ? result === "PASS" : undefined}
        />
        <div className="flex-1">{renderContent()}</div>
      </div>
    </div>
  );
}

// ─── TASK 4 SCENES ────────────────────────────────────────────────────────────

function Task4Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < TASK4_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK4_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task4Scene2({ result, onComplete }) {
  const [phase, setPhase] = useState("userReturn");
  const [lineIndex, setLineIndex] = useState(0);
  const [finalResponseText, setFinalResponseText] = useState("");

  const initialLines =
    result === "PASS" ? TASK4_PASS_INITIAL : TASK4_FAIL_INITIAL;
  const userChoiceOptions =
    result === "PASS" ? TASK4_PASS_USER_OPTIONS : TASK4_FAIL_USER_OPTIONS;
  const explanationLines =
    result === "PASS" ? TASK4_PASS_EXPLANATION : TASK4_FAIL_EXPLANATION;
  const lectureLines =
    result === "PASS" ? TASK4_PASS_LECTURE : TASK4_FAIL_LECTURE;

  const handleAdvance = () => {
    if (phase === "userReturn") {
      setPhase("initial");
      setLineIndex(0);
    } else if (phase === "initial") {
      if (lineIndex < initialLines.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("userChoice");
        setLineIndex(0);
      }
    } else if (phase === "explanation") {
      if (lineIndex < explanationLines.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("lecture");
        setLineIndex(0);
      }
    } else if (phase === "lecture") {
      if (lineIndex < lectureLines.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("finalChoice");
        setLineIndex(0);
      }
    } else if (phase === "finalResponse") {
      onComplete();
    }
  };

  const handleUserChoice = () => {
    setPhase("explanation");
    setLineIndex(0);
  };
  const handleFinalChoice = (id) => {
    setPhase("finalResponse");
    setLineIndex(0);
    setFinalResponseText(TASK4_FINAL_RESPONSES[id]);
  };

  const isLast = phase === "finalResponse";

  const renderContent = () => {
    if (phase === "userReturn")
      return (
        <DialogueBubble
          key="user-return"
          line={TASK4_USER_RETURN}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "initial")
      return (
        <DialogueBubble
          key={`initial-${lineIndex}`}
          line={initialLines[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "userChoice")
      return (
        <ChoiceMenu options={userChoiceOptions} onSelect={handleUserChoice} />
      );
    if (phase === "explanation")
      return (
        <DialogueBubble
          key={`explanation-${lineIndex}`}
          line={explanationLines[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "lecture")
      return (
        <DialogueBubble
          key={`lecture-${lineIndex}`}
          line={lectureLines[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "finalChoice")
      return (
        <ChoiceMenu
          options={TASK4_FINAL_OPTIONS}
          onSelect={handleFinalChoice}
        />
      );
    if (phase === "finalResponse")
      return (
        <DialogueBubble
          key="final-response"
          line={{ speaker: "Manager", text: finalResponseText }}
          onAdvance={handleAdvance}
        />
      );
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={
            phase === "initial" || phase === "userReturn"
              ? result === "PASS"
              : undefined
          }
        />
        <div className="flex-1">
          {renderContent()}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 5 SCENES ────────────────────────────────────────────────────────────

function Task5Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < TASK5_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK5_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task5Scene2({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const currentLine = TASK5_SCENE_2_LINES[lineIndex];
  const handleAdvance = () => {
    if (lineIndex < TASK5_SCENE_2_LINES.length - 1) setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label={currentLine.speaker === "You" ? "🧑" : "🧑🏻‍💼"} />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={currentLine}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task5Scene3({ result, onComplete }) {
  const lines =
    result === "PASS" ? TASK5_DEBRIEFING_PASS : TASK5_DEBRIEFING_FAIL;
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < lines.length - 1) setLineIndex((i) => i + 1);
    else onComplete();
  };
  const isLast = lineIndex === lines.length - 1;
  const currentLine = lines[lineIndex];
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label={currentLine.speaker === "You" ? "🧑" : "🧑🏻‍💼"}
          pass={
            currentLine.speaker === "Manager" && lineIndex > 0
              ? result === "PASS"
              : undefined
          }
        />
        <div className="flex-1">
          <DialogueBubble
            key={lineIndex}
            line={currentLine}
            onAdvance={handleAdvance}
          />
          {isLast && (
            <button
              onClick={handleAdvance}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 6 SCENES ────────────────────────────────────────────────────────────

function Task6Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < TASK6_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK6_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task6Scene2({ onComplete }) {
  const [phase, setPhase] = useState("userReturn");
  const [lineIndex, setLineIndex] = useState(0);
  const [finalResponseText, setFinalResponseText] = useState("");

  const handleAdvance = () => {
    if (phase === "userReturn") {
      setPhase("initial");
      setLineIndex(0);
    } else if (phase === "initial") {
      if (lineIndex < TASK6_PASS_INITIAL.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("userChoice");
        setLineIndex(0);
      }
    } else if (phase === "explanation") {
      if (lineIndex < TASK6_PASS_EXPLANATION.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("lecture");
        setLineIndex(0);
      }
    } else if (phase === "lecture") {
      if (lineIndex < TASK6_LECTURE_LINES.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("finalChoice");
        setLineIndex(0);
      }
    } else if (phase === "finalResponse") {
      onComplete();
    }
  };

  const handleUserChoice = () => {
    setPhase("explanation");
    setLineIndex(0);
  };
  const handleFinalChoice = (id) => {
    setPhase("finalResponse");
    setLineIndex(0);
    setFinalResponseText(TASK6_FINAL_RESPONSES[id]);
  };

  const isLast = phase === "finalResponse";

  const renderContent = () => {
    if (phase === "userReturn")
      return (
        <DialogueBubble
          key="user-return"
          line={TASK6_USER_RETURN}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "initial")
      return (
        <DialogueBubble
          key={`initial-${lineIndex}`}
          line={TASK6_PASS_INITIAL[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "userChoice")
      return (
        <ChoiceMenu
          options={TASK6_PASS_USER_OPTIONS}
          onSelect={handleUserChoice}
        />
      );
    if (phase === "explanation")
      return (
        <DialogueBubble
          key={`explanation-${lineIndex}`}
          line={TASK6_PASS_EXPLANATION[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "lecture")
      return (
        <DialogueBubble
          key={`lecture-${lineIndex}`}
          line={TASK6_LECTURE_LINES[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "finalChoice")
      return (
        <ChoiceMenu
          options={TASK6_FINAL_OPTIONS}
          onSelect={handleFinalChoice}
        />
      );
    if (phase === "finalResponse")
      return (
        <DialogueBubble
          key="final-response"
          line={{ speaker: "Manager", text: finalResponseText }}
          onAdvance={handleAdvance}
        />
      );
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={
            phase === "initial" || phase === "userReturn" ? true : undefined
          }
        />
        <div className="flex-1">
          {renderContent()}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 7 SCENES ────────────────────────────────────────────────────────────

function Task7Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < TASK7_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK7_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task7SceneFail({ onComplete }) {
  const [phase, setPhase] = useState("lines");
  const [lineIndex, setLineIndex] = useState(0);

  const handleAdvance = () => {
    if (phase === "lines") {
      if (lineIndex < TASK7_FAIL_LINES.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("userChoice");
        setLineIndex(0);
      }
    } else if (phase === "explanation") {
      if (lineIndex < TASK7_FAIL_EXPLANATION.length - 1)
        setLineIndex((i) => i + 1);
      else onComplete();
    }
  };

  const handleUserChoice = () => {
    setPhase("explanation");
    setLineIndex(0);
  };
  const isLast =
    phase === "explanation" && lineIndex === TASK7_FAIL_EXPLANATION.length - 1;
  const currentLine =
    phase === "lines"
      ? TASK7_FAIL_LINES[lineIndex]
      : phase === "explanation"
        ? TASK7_FAIL_EXPLANATION[lineIndex]
        : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label={currentLine?.speaker === "You" ? "🧑" : "🧑🏻‍💼"}
          pass={phase === "explanation" ? false : undefined}
        />
        <div className="flex-1">
          {phase === "userChoice" ? (
            <ChoiceMenu
              options={TASK7_FAIL_USER_OPTIONS}
              onSelect={handleUserChoice}
            />
          ) : currentLine ? (
            <DialogueBubble
              key={`${phase}-${lineIndex}`}
              line={currentLine}
              onAdvance={handleAdvance}
            />
          ) : null}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Task7ScenePass({ onComplete }) {
  const [phase, setPhase] = useState("userReturn");
  const [lineIndex, setLineIndex] = useState(0);
  const [finalResponseText, setFinalResponseText] = useState("");

  const handleAdvance = () => {
    if (phase === "userReturn") {
      setPhase("initial");
      setLineIndex(0);
    } else if (phase === "initial") {
      if (lineIndex < TASK7_PASS_INITIAL.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("userChoice");
        setLineIndex(0);
      }
    } else if (phase === "explanation") {
      if (lineIndex < TASK7_PASS_EXPLANATION.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("lecture");
        setLineIndex(0);
      }
    } else if (phase === "lecture") {
      if (lineIndex < TASK7_LECTURE_LINES.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("finalChoice");
        setLineIndex(0);
      }
    } else if (phase === "finalResponse") {
      onComplete();
    }
  };

  const handleUserChoice = () => {
    setPhase("explanation");
    setLineIndex(0);
  };
  const handleFinalChoice = (id) => {
    setFinalResponseText(TASK7_FINAL_RESPONSES[id]);
    setPhase("finalResponse");
    setLineIndex(0);
  };

  const isLast = phase === "finalResponse";

  const renderContent = () => {
    if (phase === "userReturn")
      return (
        <DialogueBubble
          key="user-return"
          line={TASK7_PASS_USER_RETURN}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "initial")
      return (
        <DialogueBubble
          key={`initial-${lineIndex}`}
          line={TASK7_PASS_INITIAL[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "userChoice")
      return (
        <ChoiceMenu
          options={TASK7_PASS_USER_OPTIONS}
          onSelect={handleUserChoice}
        />
      );
    if (phase === "explanation")
      return (
        <DialogueBubble
          key={`explanation-${lineIndex}`}
          line={TASK7_PASS_EXPLANATION[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "lecture")
      return (
        <DialogueBubble
          key={`lecture-${lineIndex}`}
          line={TASK7_LECTURE_LINES[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "finalChoice")
      return (
        <ChoiceMenu
          options={TASK7_FINAL_OPTIONS}
          onSelect={handleFinalChoice}
        />
      );
    if (phase === "finalResponse")
      return (
        <DialogueBubble
          key="final-response"
          line={{ speaker: "Manager", text: finalResponseText }}
          onAdvance={handleAdvance}
        />
      );
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label="🧑🏻‍💼"
          pass={
            phase === "initial" || phase === "userReturn" ? true : undefined
          }
        />
        <div className="flex-1">
          {renderContent()}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 8 SCENES ────────────────────────────────────────────────────────────

function Task8Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < TASK8_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK8_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

function Task8Scene2({ result, onComplete }) {
  const [phase, setPhase] = useState("userReturn");
  const [lineIndex, setLineIndex] = useState(0);
  const [reflectionResponse, setReflectionResponse] = useState("");

  const initialLines =
    result === "PASS" ? TASK8_PASS_INITIAL : TASK8_FAIL_INITIAL;
  const lectureLines =
    result === "PASS" ? TASK8_PASS_LECTURE : TASK8_FAIL_LECTURE;

  const userReturn =
    result === "PASS"
      ? {
          speaker: "You",
          text: "My friend was getting cyberbullied online. I helped her. I guided her through it step by step.",
        }
      : {
          speaker: "You",
          text: "My friend was getting cyberbullied online. I wasn't sure… I just tried to help.",
        };

  const handleAdvance = () => {
    if (phase === "userReturn") {
      setPhase("initial");
      setLineIndex(0);
    } else if (phase === "initial") {
      if (lineIndex < initialLines.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("lecture");
        setLineIndex(0);
      }
    } else if (phase === "lecture") {
      if (lineIndex < lectureLines.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("reflection");
        setLineIndex(0);
      }
    } else if (phase === "reflectionResponse") {
      onComplete();
    }
  };

  const handleReflection = (id) => {
    setReflectionResponse(TASK8_REFLECTION_RESPONSES[id]);
    setPhase("reflectionResponse");
    setLineIndex(0);
  };

  const isLast = phase === "reflectionResponse";

  const renderContent = () => {
    if (phase === "userReturn")
      return (
        <DialogueBubble
          key="user-return"
          line={userReturn}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "initial")
      return (
        <DialogueBubble
          key={`initial-${lineIndex}`}
          line={initialLines[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "lecture")
      return (
        <DialogueBubble
          key={`lecture-${lineIndex}`}
          line={lectureLines[lineIndex]}
          onAdvance={handleAdvance}
        />
      );
    if (phase === "reflection")
      return (
        <ChoiceMenu
          options={TASK8_REFLECTION_OPTIONS}
          onSelect={handleReflection}
        />
      );
    if (phase === "reflectionResponse")
      return (
        <DialogueBubble
          key="reflection-response"
          line={{ speaker: "Manager", text: reflectionResponse }}
          onAdvance={handleAdvance}
        />
      );
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label={phase === "userReturn" ? "🧑" : "🧑🏻‍💼"}
          pass={phase === "initial" ? result === "PASS" : undefined}
        />
        <div className="flex-1">
          {renderContent()}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 9 SCENES ────────────────────────────────────────────────────────────

/**
 * Task9USBFound
 * Shown as a full-screen overlay (not inside the yellow dialogue box)
 * when the player walks near the USB.
 * Renders the two-choice prompt: Plug In vs Report.
 */
function Task9USBFound({ onPlugIn, onReport }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[950] flex flex-col items-center font-sans">
      <div className="bg-yellow-400 rounded-2xl border-4 border-indigo-900 shadow-[6px_6px_0_0_#4338ca] px-5 py-4 w-[300px] flex flex-col gap-3">
        <p className="text-center text-sm font-black text-indigo-900 leading-snug">
          💾 Unknown USB found on the floor!
        </p>

        <div className="flex gap-2">
          <button
            onClick={onPlugIn}
            className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-pink-500 border-b-4 border-pink-800 hover:bg-pink-600 active:translate-y-0.5 active:border-b-2 transition-all text-center"
          >
            🔌 Plug In
          </button>
          <button
            onClick={onReport}
            className="flex-1 py-2.5 rounded-xl text-xs font-black text-white bg-pink-500 border-b-4 border-pink-800 hover:bg-pink-600 active:translate-y-0.5 active:border-b-2 transition-all text-center"
          >
            🙋 Report
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Task9DebriefFail
 * Dialogue with manager after the BadUSB simulation (FAIL path).
 */
function Task9DebriefFail({ onComplete }) {
  const [phase, setPhase] = useState("incident");
  const [lineIndex, setLineIndex] = useState(0);
  const [choiceResponse, setChoiceResponse] = useState("");

  const handleAdvance = () => {
    if (phase === "incident") {
      if (lineIndex < TASK9_FAIL_INCIDENT_LINES.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("explanation");
        setLineIndex(0);
      }
    } else if (phase === "explanation") {
      if (lineIndex < TASK9_FAIL_EXPLANATION.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("choice");
        setLineIndex(0);
      }
    } else if (phase === "choiceResponse") {
      setPhase("reveal");
      setLineIndex(0);
    } else if (phase === "reveal") {
      if (lineIndex < TASK9_FAIL_REVEAL.length - 1) setLineIndex((i) => i + 1);
      else {
        setPhase("apology");
        setLineIndex(0);
      }
    } else if (phase === "final") {
      if (lineIndex < TASK9_FAIL_FINAL_LINES.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("closing");
        setLineIndex(0);
      }
    } else if (phase === "closingResponse") {
      onComplete();
    }
  };

  const handleChoice = (id) => {
    setChoiceResponse(TASK9_FAIL_CHOICE_RESPONSES[id]);
    setPhase("choiceResponse");
    setLineIndex(0);
  };

  const handleApology = () => {
    setPhase("final");
    setLineIndex(0);
  };
  const handleClosing = (id) => {
    setChoiceResponse(TASK9_CLOSING_RESPONSES[id]);
    setPhase("closingResponse");
    setLineIndex(0);
  };

  const isLast = phase === "closingResponse";

  const currentLine = (() => {
    if (phase === "incident") return TASK9_FAIL_INCIDENT_LINES[lineIndex];
    if (phase === "explanation") return TASK9_FAIL_EXPLANATION[lineIndex];
    if (phase === "choiceResponse")
      return { speaker: "Manager", text: choiceResponse };
    if (phase === "reveal") return TASK9_FAIL_REVEAL[lineIndex];
    if (phase === "final") return TASK9_FAIL_FINAL_LINES[lineIndex];
    if (phase === "closingResponse")
      return { speaker: "Manager", text: choiceResponse };
    return null;
  })();

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label={currentLine?.speaker === "You" ? "🧑" : "🧑🏻‍💼"}
          pass={
            phase === "incident" || phase === "explanation" ? false : undefined
          }
        />
        <div className="flex-1">
          {phase === "choice" && (
            <ChoiceMenu
              options={TASK9_FAIL_CHOICE_OPTIONS}
              onSelect={handleChoice}
            />
          )}
          {phase === "apology" && (
            <ChoiceMenu
              options={TASK9_FAIL_APOLOGY_OPTIONS}
              onSelect={handleApology}
            />
          )}
          {phase === "closing" && (
            <ChoiceMenu
              options={TASK9_CLOSING_OPTIONS}
              onSelect={handleClosing}
            />
          )}
          {currentLine &&
            phase !== "choice" &&
            phase !== "apology" &&
            phase !== "closing" && (
              <DialogueBubble
                key={`${phase}-${lineIndex}`}
                line={currentLine}
                onAdvance={handleAdvance}
              />
            )}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Task9DebriefPass
 * Dialogue with manager after reporting the USB (PASS path).
 */
function Task9DebriefPass({ onComplete }) {
  const [phase, setPhase] = useState("opening");
  const [lineIndex, setLineIndex] = useState(0);
  const [choiceResponse, setChoiceResponse] = useState("");

  const handleAdvance = () => {
    if (phase === "opening") {
      if (lineIndex < TASK9_PASS_OPENING_LINES.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("explanation");
        setLineIndex(0);
      }
    } else if (phase === "explanation") {
      if (lineIndex < TASK9_PASS_EXPLANATION.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("userChoice");
        setLineIndex(0);
      }
    } else if (phase === "continuation") {
      if (lineIndex < TASK9_PASS_CONTINUATION.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("closing");
        setLineIndex(0);
      }
    } else if (phase === "closingResponse") {
      onComplete();
    }
  };

  const handleUserChoice = () => {
    setPhase("continuation");
    setLineIndex(0);
  };
  const handleClosing = (id) => {
    setChoiceResponse(TASK9_CLOSING_RESPONSES[id]);
    setPhase("closingResponse");
    setLineIndex(0);
  };

  const isLast = phase === "closingResponse";

  const currentLine = (() => {
    if (phase === "opening") return TASK9_PASS_OPENING_LINES[lineIndex];
    if (phase === "explanation") return TASK9_PASS_EXPLANATION[lineIndex];
    if (phase === "continuation") return TASK9_PASS_CONTINUATION[lineIndex];
    if (phase === "closingResponse")
      return { speaker: "Manager", text: choiceResponse };
    return null;
  })();

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar
          label={currentLine?.speaker === "You" ? "🧑" : "🧑🏻‍💼"}
          pass={true}
        />
        <div className="flex-1">
          {phase === "userChoice" && (
            <ChoiceMenu
              options={TASK9_PASS_USER_OPTIONS}
              onSelect={handleUserChoice}
            />
          )}
          {phase === "closing" && (
            <ChoiceMenu
              options={TASK9_CLOSING_OPTIONS}
              onSelect={handleClosing}
            />
          )}
          {currentLine && phase !== "userChoice" && phase !== "closing" && (
            <DialogueBubble
              key={`${phase}-${lineIndex}`}
              line={currentLine}
              onAdvance={handleAdvance}
            />
          )}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Finish Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── TASK 10 SCENES ───────────────────────────────────────────────────────────

function Task10Scene1({ onComplete }) {
  const [lineIndex, setLineIndex] = useState(0);
  const handleAdvance = () => {
    if (lineIndex < TASK10_SCENE_1_OPENING.length - 1)
      setLineIndex((i) => i + 1);
    else onComplete();
  };
  return (
    <div className="flex gap-4 items-start">
      <Avatar label="🧑🏻‍💼" />
      <div className="flex-1">
        <DialogueBubble
          key={lineIndex}
          line={TASK10_SCENE_1_OPENING[lineIndex]}
          onAdvance={handleAdvance}
        />
      </div>
    </div>
  );
}

// ─── TASK 11 SCENES ───────────────────────────────────────────────────────────

function Task11GoodbyeScene({ onComplete }) {
  const [phase, setPhase] = useState("lines");
  const [lineIndex, setLineIndex] = useState(0);
  const [finalResponse, setFinalResponse] = useState("");

  const handleAdvance = () => {
    if (phase === "lines") {
      if (lineIndex < TASK11_GOODBYE_LINES.length - 1)
        setLineIndex((i) => i + 1);
      else {
        setPhase("choice");
        setLineIndex(0);
      }
    } else if (phase === "finalResponse") {
      onComplete();
    }
  };

  const handleChoice = (id) => {
    setFinalResponse(TASK11_GOODBYE_RESPONSES[id]);
    setPhase("finalResponse");
    setLineIndex(0);
  };

  const isLast = phase === "finalResponse";
  const currentLine =
    phase === "lines"
      ? TASK11_GOODBYE_LINES[lineIndex]
      : phase === "finalResponse"
        ? { speaker: "Manager", text: finalResponse }
        : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start">
        <Avatar label="🧑🏻‍💼" pass={true} />
        <div className="flex-1">
          {phase === "choice" ? (
            <ChoiceMenu
              options={TASK11_GOODBYE_OPTIONS}
              onSelect={handleChoice}
            />
          ) : currentLine ? (
            <DialogueBubble
              key={`${phase}-${lineIndex}`}
              line={currentLine}
              onAdvance={handleAdvance}
            />
          ) : null}
          {isLast && (
            <button
              onClick={onComplete}
              className="mt-4 w-full bg-yellow-400 hover:bg-yellow-500 text-indigo-900 py-3 rounded-2xl text-lg font-black border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all"
            >
              Goodbye 👋
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main DialogueScene ───────────────────────────────────────────────────────

export default function DialogueScene() {
  const { mission, setMission } = useMission();

  // Task 1
  const isTask1Scene1 = mission.stage === "TALKING_TO_MANAGER";
  const isTask1Scene2 = mission.stage === "DEBRIEFING";
  // Task 2
  const isTask2Scene1 = mission.stage === "TASK2_TALKING_TO_MANAGER";
  const isTask2Scene2 = mission.stage === "TASK2_DEBRIEFING";
  // Task 3
  const isTask3Scene1 = mission.stage === "TASK3_TALKING_TO_MANAGER";
  const isTask3Scene2 = mission.stage === "TASK3_DEBRIEFING";
  // Task 4
  const isTask4Scene1 = mission.stage === "TASK4_TALKING_TO_MANAGER";
  const isTask4Scene2 = mission.stage === "TASK4_DEBRIEFING";
  // Task 5
  const isTask5Scene1 = mission.stage === "TASK5_TALKING_TO_MANAGER";
  const isTask5Scene2 = mission.stage === "TASK5_ASKING_NPC_FOR_IT";
  const isTask5Scene3 = mission.stage === "TASK5_DEBRIEFING";
  // Task 6
  const isTask6Scene1 = mission.stage === "TASK6_TALKING_TO_MANAGER";
  const isTask6Scene2 = mission.stage === "TASK6_DEBRIEFING";
  // Task 7
  const isTask7Scene1 = mission.stage === "TASK7_TALKING_TO_MANAGER";
  const isTask7SceneFail =
    mission.stage === "TASK7_DEBRIEFING" && mission.result === "FAIL";
  const isTask7ScenePass =
    mission.stage === "TASK7_DEBRIEFING" && mission.result === "PASS";
  // Task 8
  const isTask8Scene1 = mission.stage === "TASK8_TALKING_TO_MANAGER";
  const isTask8Scene2 = mission.stage === "TASK8_DEBRIEFING";
  // Task 9
  const isTask9USBFound =
    mission.id === "TASK_9_USB_BADUSB" && mission.stage === "TASK9_USB_FOUND";
  const isTask9DebriefFail =
    mission.id === "TASK_9_USB_BADUSB" &&
    mission.stage === "TASK9_DEBRIEFING_FAIL";
  const isTask9DebriefPass =
    mission.id === "TASK_9_USB_BADUSB" &&
    mission.stage === "TASK9_DEBRIEFING_PASS";
  // Task 10
  const isTask10Scene1 = mission.stage === "TASK10_TALKING_TO_MANAGER";
  // Task 11
  const isTask11Goodbye = mission.stage === "TASK11_GOODBYE_DIALOGUE";

  const anyActive =
    isTask1Scene1 ||
    isTask1Scene2 ||
    isTask2Scene1 ||
    isTask2Scene2 ||
    isTask3Scene1 ||
    isTask3Scene2 ||
    isTask4Scene1 ||
    isTask4Scene2 ||
    isTask5Scene1 ||
    isTask5Scene2 ||
    isTask5Scene3 ||
    isTask6Scene1 ||
    isTask6Scene2 ||
    isTask7Scene1 ||
    isTask7SceneFail ||
    isTask7ScenePass ||
    isTask8Scene1 ||
    isTask8Scene2 ||
    isTask10Scene1 ||
    isTask11Goodbye;

  // ── Task 9 USB Found — rendered as full-screen overlay, NOT inside yellow box ──
  if (isTask9USBFound) {
    return (
      <Task9USBFound
        onPlugIn={() =>
          setMission({
            ...mission,
            stage: "TASK9_GO_TO_PC_FAIL",
            result: "FAIL",
          })
        }
        onReport={() =>
          setMission({
            ...mission,
            stage: "TASK9_REPORT_TO_NPC",
            result: "PASS",
          })
        }
      />
    );
  }

  // ── Task 9 debrief scenes — inside yellow box ──
  if (isTask9DebriefFail || isTask9DebriefPass) {
    return (
      <div className="fixed inset-0 bg-opacity-0 z-[900] flex items-end justify-center p-4 font-sans">
        <div className="w-full max-w-3xl bg-yellow-400 p-6 rounded-[2rem] border-4 border-indigo-900 shadow-[10px_10px_0_0_#4338ca] mb-4">
          {isTask9DebriefFail && (
            <Task9DebriefFail
              onComplete={() =>
                setMission({
                  id: "TASK_10_FINAL_QUIZ",
                  stage: "TASK10_TALK_TO_MANAGER",
                  result: null,
                  unsafeFields: [],
                  selectedUrl: null,
                  emailActions: {},
                  incorrectlyHandled: [],
                })
              }
            />
          )}
          {isTask9DebriefPass && (
            <Task9DebriefPass
              onComplete={() =>
                setMission({
                  id: "TASK_10_FINAL_QUIZ",
                  stage: "TASK10_TALK_TO_MANAGER",
                  result: null,
                  unsafeFields: [],
                  selectedUrl: null,
                  emailActions: {},
                  incorrectlyHandled: [],
                })
              }
            />
          )}
        </div>
      </div>
    );
  }

  if (!anyActive) return null;

  // ── Task 1 handlers ──
  const handleTask1Scene1Complete = () =>
    setMission({ ...mission, stage: "GO_TO_WORKSPACE" });
  const handleTask1Scene2Complete = () =>
    setMission({
      id: "TASK_2_PHONE_SECURITY",
      stage: "TASK2_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
    });

  // ── Task 2 handlers ──
  const handleTask2Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK2_WAITING_FOR_MESSAGE" });
  const handleTask2Scene2Complete = () =>
    setMission({
      id: "TASK_3_URL_SECURITY",
      stage: "TASK3_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
    });

  // ── Task 3 handlers ──
  const handleTask3Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK3_GO_TO_LAPTOP" });
  const handleTask3Scene2Complete = () =>
    setMission({
      id: "TASK_4_EMAIL_SECURITY",
      stage: "TASK4_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });

  // ── Task 4 handlers ──
  const handleTask4Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK4_GO_TO_LAPTOP" });
  const handleTask4Scene2Complete = () =>
    setMission({
      id: "TASK_5_PASSWORD_SECURITY",
      stage: "TASK5_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });

  // ── Task 5 handlers ──
  const handleTask5Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK5_GO_TO_LAPTOP" });
  const handleTask5Scene2Complete = () =>
    setMission({ ...mission, stage: "TASK5_PHONE_CHAT" });
  const handleTask5Scene3Complete = () =>
    setMission({
      id: "TASK_6_MALVERTISING",
      stage: "TASK6_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });

  // ── Task 6 handlers ──
  const handleTask6Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK6_GO_TO_LAPTOP" });
  const handleTask6Scene2Complete = () =>
    setMission({
      id: "TASK_7_FAKE_MODERATOR",
      stage: "TASK7_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });

  // ── Task 7 handlers ──
  const handleTask7Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK7_GO_TO_DESK" });
  const handleTask7DebriefComplete = () =>
    setMission({
      id: "TASK_8_CYBERBULLYING",
      stage: "TASK8_TALK_TO_MANAGER",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });

  // ── Task 8 handlers ──
  const handleTask8Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK8_WAITING_FOR_MESSAGE" });
  // ── Task 10 handlers ──
  const handleTask10Scene1Complete = () =>
    setMission({ ...mission, stage: "TASK10_QUIZ" });

  // ── Task 11 handlers ──
  const handleTask11GoodbyeComplete = () =>
    setMission({ ...mission, stage: "TASK11_CREDITS" });

  const handleTask8Scene2Complete = () =>
    setMission({
      id: "TASK_9_USB_BADUSB",
      stage: "TASK9_FIND_USB",
      result: null,
      unsafeFields: [],
      selectedUrl: null,
      emailActions: {},
      incorrectlyHandled: [],
    });

  return (
    <div className="fixed inset-0 bg-opacity-0 z-[900] flex items-end justify-center p-4 font-sans">
      <div className="w-full max-w-3xl bg-yellow-400 p-6 rounded-[2rem] border-4 border-indigo-900 shadow-[10px_10px_0_0_#4338ca] mb-4">
        {/* Task 1 */}
        {isTask1Scene1 && (
          <Task1Scene1 onComplete={handleTask1Scene1Complete} />
        )}
        {isTask1Scene2 && (
          <Task1Scene2
            result={mission.result}
            unsafeFields={mission.unsafeFields}
            onComplete={handleTask1Scene2Complete}
          />
        )}

        {/* Task 2 */}
        {isTask2Scene1 && (
          <Task2Scene1 onComplete={handleTask2Scene1Complete} />
        )}
        {isTask2Scene2 && (
          <Task2Scene2
            result={mission.result}
            onComplete={handleTask2Scene2Complete}
          />
        )}

        {/* Task 3 */}
        {isTask3Scene1 && (
          <Task3Scene1 onComplete={handleTask3Scene1Complete} />
        )}
        {isTask3Scene2 && (
          <Task3Scene2
            result={mission.result}
            selectedUrl={mission.selectedUrl}
            onComplete={handleTask3Scene2Complete}
          />
        )}

        {/* Task 4 */}
        {isTask4Scene1 && (
          <Task4Scene1 onComplete={handleTask4Scene1Complete} />
        )}
        {isTask4Scene2 && (
          <Task4Scene2
            result={mission.result}
            onComplete={handleTask4Scene2Complete}
          />
        )}

        {/* Task 5 */}
        {isTask5Scene1 && (
          <Task5Scene1 onComplete={handleTask5Scene1Complete} />
        )}
        {isTask5Scene2 && (
          <Task5Scene2 onComplete={handleTask5Scene2Complete} />
        )}
        {isTask5Scene3 && (
          <Task5Scene3
            result={mission.result}
            onComplete={handleTask5Scene3Complete}
          />
        )}

        {/* Task 6 */}
        {isTask6Scene1 && (
          <Task6Scene1 onComplete={handleTask6Scene1Complete} />
        )}
        {isTask6Scene2 && (
          <Task6Scene2 onComplete={handleTask6Scene2Complete} />
        )}

        {/* Task 7 */}
        {isTask7Scene1 && (
          <Task7Scene1 onComplete={handleTask7Scene1Complete} />
        )}
        {isTask7SceneFail && (
          <Task7SceneFail onComplete={handleTask7DebriefComplete} />
        )}
        {isTask7ScenePass && (
          <Task7ScenePass onComplete={handleTask7DebriefComplete} />
        )}

        {/* Task 8 */}
        {isTask8Scene1 && (
          <Task8Scene1 onComplete={handleTask8Scene1Complete} />
        )}
        {isTask8Scene2 && (
          <Task8Scene2
            result={mission.result}
            onComplete={handleTask8Scene2Complete}
          />
        )}

        {/* Task 10 */}
        {isTask10Scene1 && (
          <Task10Scene1 onComplete={handleTask10Scene1Complete} />
        )}

        {/* Task 11 */}
        {isTask11Goodbye && (
          <Task11GoodbyeScene onComplete={handleTask11GoodbyeComplete}
          />
        )}
      </div>
    </div>
  );
}
