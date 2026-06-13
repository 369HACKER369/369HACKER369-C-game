import { NPC, GameState, TruthStatus } from './types';

export const ALL_NPCS: NPC[] = [
  { id: 'ada', name: 'Ada', role: 'Farmer', gender: 'Female', topic: 'Unit #1: Variables & Constants', personality: 'Observant', 
    introDialogue: 'Howdy! I was just tending to my crops. Need some help?',
    question: { text: 'Which is NOT a valid C++ variable name?', options: ['_myVar', '2ndVar', 'var2', 'my_var'], correctIndex: 1, explanation: 'Variables cannot start with a digit in C++.' } },
  
  { id: 'bran', name: 'Bran', role: 'Teacher', gender: 'Male', topic: 'Unit #2: Decisions (if/else)', personality: 'Analytical', 
    introDialogue: 'Ah, a detective. I teach logic and decision-making. Perhaps I can test yours?',
    question: { text: 'If we compile: if (5 > 3) if (false) cout << "A"; else cout << "B"; what is the output?', options: ['A', 'B', 'Nothing', 'Compilation Error'], correctIndex: 1, explanation: 'The else is associated with the closest preceding if structural body (the false one).' } },

  { id: 'celia', name: 'Celia', role: 'Guard', gender: 'Female', topic: 'Unit #3: Loops (do-while)', personality: 'Vigilant', 
    introDialogue: 'Stand back! The crime scene is off-limits. Unless... you can prove you know your loops.',
    question: { text: 'Which loop is guaranteed to execute at least once because its condition is evaluated at the end?', options: ['for loop', 'while loop', 'do-while loop', 'infinite loop'], correctIndex: 2, explanation: 'do-while evaluates its condition AFTER the body executes.' } },

  { id: 'dax', name: 'Dax', role: 'Scientist', gender: 'Male', topic: 'Unit #1: Von-Neumann Architecture', personality: 'Eccentric', 
    introDialogue: 'Fascinating! The crime perfectly patterns computer structure. Oh, wait, you need evidence?',
    question: { text: 'In the Von-Neumann architecture, which component of the CPU is responsible for executing arithmetic and logical comparisons?', options: ['Control Unit', 'Arithmetic Logic Unit (ALU)', 'Accumulator', 'Main Memory'], correctIndex: 1, explanation: 'The ALU executes all arithmetic operations and relational/logical comparisons.' } },

  { id: 'enid', name: 'Enid', role: 'Merchant', gender: 'Female', topic: 'Unit #2: Multiple Selection (switch)', personality: 'Shrewd', 
    introDialogue: 'I trade in rare items and strings of data. Answer my question, and I will trade you a hint.',
    question: { text: 'Which C++ keyword is used to stop execution fall-through within a matching switch case structure?', options: ['exit', 'return', 'break', 'continue'], correctIndex: 2, explanation: 'The break keyword terminates and exits the switch select block.' } },

  { id: 'finn', name: 'Finn', role: 'Blacksmith', gender: 'Male', topic: 'Unit #1: Operators & Expressions', personality: 'Gruff', 
    introDialogue: 'Hmph. I forge strong tools and direct logical operations. What do you want?',
    question: { text: 'What is the boolean evaluation result of the C++ expression static_cast<bool>(10 % 3)?', options: ['true', 'false', '0', 'Error'], correctIndex: 0, explanation: '10 % 3 equals 1. Any non-zero integer cast/converted to bool evaluates to true.' } },

  { id: 'gemma', name: 'Gemma', role: 'Mayor', gender: 'Female', topic: 'Unit #2: Dual Branching', personality: 'Authoritative', 
    introDialogue: 'This crime is a tragedy for our organized village. We must restore order and structures!',
    question: { text: 'Which of the following structures enables choosing exactly one of two alternative courses of action?', options: ['Single Selection (if)', 'Double Selection (if/else)', 'Multiple selection (switch)', 'Counter Loop (for)'], correctIndex: 1, explanation: 'Double selection (if/else) models a binary choice path.' } },

  { id: 'hugo', name: 'Hugo', role: 'Doctor', gender: 'Male', topic: 'Unit #1: Program Errors', personality: 'Calm', 
    introDialogue: 'Breathe deeply. I just output formatted health advice, but I noticed something unusual today.',
    question: { text: 'Which type of error compiles successfully but produces incorrect results at runtime?', options: ['Syntax Error', 'Linker Error', 'Logical Error', 'Preprocessing Error'], correctIndex: 2, explanation: 'Logical errors do not violate grammatical rules and compile correctly but perform incorrect logic.' } },

  { id: 'iris', name: 'Iris', role: 'Chef', gender: 'Female', topic: 'Unit #3: Loop Control (break/continue)', personality: 'Busy', 
    introDialogue: "I'm trying to read my recipe file, but it's corrupted! Maybe the criminal did it?",
    question: { text: 'Inside a loop block, which statement skips the remaining body actions of the current iteration and jumps directly to the next conditional evaluation count?', options: ['break', 'return', 'continue', 'goto'], correctIndex: 2, explanation: 'The continue statement skips the rest of the loop body, advancing directly to the next iteration evaluation.' } }
];

export function generateHints(criminalId: string, truthStatuses: Record<string, TruthStatus>): Record<string, string> {
  const criminal = ALL_NPCS.find(n => n.id === criminalId)!;
  const hints: Record<string, string> = {};
  
  ALL_NPCS.forEach(npc => {
    const status = truthStatuses[npc.id];
    let hint = '';

    const criminalGender = criminal.gender;
    const criminalRole = criminal.role;
    
    const otherGenders = criminalGender === 'Male' ? 'Female' : 'Male';
    const otherRoles = ALL_NPCS.filter(n => n.id !== criminal.id).map(n => n.role);
    const randomWrongRole = otherRoles[Math.floor(Math.random() * otherRoles.length)];

    if (apiRandomH(npc.id) < 0.3) {
      if (status === 'Truth') hint = `The criminal is a ${criminalGender}.`;
      else if (status === 'Liar') hint = `I saw the criminal. They were a ${otherGenders}.`;
      else hint = `I don't know, maybe they are a ${criminalGender} or a ${otherGenders}.`;
    } else if (apiRandomH(npc.id + 1) < 0.6) {
      if (status === 'Truth') hint = `The criminal works as a ${criminalRole}.`;
      else if (status === 'Liar') hint = `I'm pretty sure the criminal is the ${randomWrongRole}.`;
      else hint = `Could be the ${criminalRole}? Or maybe the ${randomWrongRole}.`;
    } else {
      if (status === 'Truth') hint = `It is a fact that the criminal is NOT the ${randomWrongRole}.`;
      else if (status === 'Liar') hint = `The criminal is definitely NOT the ${criminalRole}.`;
      else hint = `I can't say for sure if they are the ${randomWrongRole} or not.`;
    }
    
    if (npc.id === criminal.id) {
        if (apiRandomH(npc.id) < 0.5) hint = `I am innocent! Look for a ${otherGenders}, perhaps?`;
        else hint = `I didn't do it! I bet it was the ${randomWrongRole}.`;
    }

    hints[npc.id] = hint;
  });
  return hints;
}

// Simple seedable random for consistent hints
function apiRandomH(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    return Math.abs(hash) / 2147483647;
}

export function initGame(): GameState {
  const shuffled = [...ALL_NPCS].sort(() => 0.5 - Math.random());
  const criminal = shuffled[0];
  
  const statuses: Record<string, TruthStatus> = {};
  statuses[criminal.id] = 'Liar'; // Criminal always lies
  
  const remaining = shuffled.slice(1);
  for (let i = 0; i < remaining.length; i++) {
    if (i < 4) statuses[remaining[i].id] = 'Truth'; // 4 honest
    else if (i < 7) statuses[remaining[i].id] = 'Liar'; // 3 liars + 1 criminal = 4 liars total
    else statuses[remaining[i].id] = 'Neutral'; // 1 neutral
  }

  const hints = generateHints(criminal.id, statuses);

  const npcProgress: any = {};
  ALL_NPCS.forEach(n => {
    npcProgress[n.id] = { talkedTo: false, questionPassed: false, failedAttempts: 0, scanned: false };
  });

  return {
    screen: 'intro',
    criminalId: criminal.id,
    npcTruthStatuses: statuses,
    npcHints: hints,
    evidencePoints: 0,
    npcProgress,
    currentNpcId: null,
    win: null
  };
}
