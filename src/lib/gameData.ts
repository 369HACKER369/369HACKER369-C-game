import { NPC, GameState, TruthStatus } from './types';

export const ALL_NPCS: NPC[] = [
  { id: 'ada', name: 'Ada', role: 'Farmer', gender: 'Female', topic: 'Unit 1: Basics', personality: 'Observant', 
    introDialogue: 'Howdy! I was just tending to my crops. Need some help?',
    question: { text: 'Which is NOT a valid C++ variable name?', options: ['_myVar', '2ndVar', 'var2', 'my_var'], correctIndex: 1, explanation: 'Variables cannot start with a digit.' } },
  
  { id: 'bran', name: 'Bran', role: 'Teacher', gender: 'Male', topic: 'Unit 2: Decisions', personality: 'Analytical', 
    introDialogue: 'Ah, a detective. I teach logic and decision-making. Perhaps I can test yours?',
    question: { text: 'if (5 > 3) if (false) cout << "A"; else cout << "B"; Output?', options: ['A', 'B', 'Nothing', 'Error'], correctIndex: 1, explanation: 'The else is associated with the closest if (the false one).' } },

  { id: 'celia', name: 'Celia', role: 'Guard', gender: 'Female', topic: 'Unit 3: Loops', personality: 'Vigilant', 
    introDialogue: 'Stand back! The crime scene is off-limits. Unless... you can prove you know your loops.',
    question: { text: 'Which loop is guaranteed to execute at least once?', options: ['for loop', 'while loop', 'do-while loop', 'infinite loop'], correctIndex: 2, explanation: 'do-while evaluates its condition AFTER the body executes.' } },

  { id: 'dax', name: 'Dax', role: 'Scientist', gender: 'Male', topic: 'Unit 4: Functions', personality: 'Eccentric', 
    introDialogue: 'Fascinating! The crime perfectly outlines a recursive pattern. Oh, wait, you need evidence?',
    question: { text: 'When a function calls itself, it is known as:', options: ['Iteration', 'Encapsulation', 'Recursion', 'Overloading'], correctIndex: 2, explanation: 'Recursion is the technique of a function calling itself.' } },

  { id: 'enid', name: 'Enid', role: 'Merchant', gender: 'Female', topic: 'Unit 5: Arrays & Strings', personality: 'Shrewd', 
    introDialogue: 'I trade in rare items and strings of data. Answer my question, and I will trade you a hint.',
    question: { text: 'What is the index of the last element in an array of size N?', options: ['N', 'N - 1', '1', '0'], correctIndex: 1, explanation: 'Arrays are 0-indexed, so the last valid index is N-1.' } },

  { id: 'finn', name: 'Finn', role: 'Blacksmith', gender: 'Male', topic: 'Unit 6: Pointers', personality: 'Gruff', 
    introDialogue: 'Hmph. I forge strong tools and direct memory references. What do you want?',
    question: { text: 'What operator is used to get the memory address of a variable?', options: ['*', '&', '->', '::'], correctIndex: 1, explanation: "The address-of operator & fetches a variable's memory location." } },

  { id: 'gemma', name: 'Gemma', role: 'Mayor', gender: 'Female', topic: 'Unit 7: Structures', personality: 'Authoritative', 
    introDialogue: 'This crime is a tragedy for our organized village. We must restore order and structure!',
    question: { text: 'How do you access member `age` of structure variable `person`?', options: ['person->age', 'person:age', 'person[age]', 'person.age'], correctIndex: 3, explanation: 'The dot (.) operator accesses structure members.' } },

  { id: 'hugo', name: 'Hugo', role: 'Doctor', gender: 'Male', topic: 'Unit 8: Inputs/Outputs', personality: 'Calm', 
    introDialogue: 'Breathe deeply. I just output formatted health advice, but I noticed something unusual today.',
    question: { text: 'Which standard function is used for formatted output in C?', options: ['cin', 'cout', 'printf', 'scanf'], correctIndex: 2, explanation: 'printf is the standard formatted output function in C.' } },

  { id: 'iris', name: 'Iris', role: 'Chef', gender: 'Female', topic: 'Unit 9: File Handling', personality: 'Busy', 
    introDialogue: "I'm trying to read my recipe file, but it's corrupted! Maybe the criminal did it?",
    question: { text: 'Which C library function is used to open a file?', options: ['open()', 'read()', 'fopen()', 'file_open()'], correctIndex: 2, explanation: 'fopen() is used to open text or binary files in C.' } }
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
