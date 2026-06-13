import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { createNoise2D } from 'simplex-noise';
import { CSM } from 'three/examples/jsm/csm/CSM.js';

// ==========================================
// DATA & LOGIC
// ==========================================
const noise2D = createNoise2D();
const ALL_NPCS_DATA = [
    { id: 'n1', name: 'Alaric', role: 'Farmer', gender: 'Male', color: 0x8b5a2b, size: [1, 1.05, 1], topic: 'Unit #1: Program Structure & Von-Neumann',
      dialogue: 'A compiler works in logical blocks, much like planning a harvest. But some parts of our system structure were altered...',
      question: { text: 'Which of the following describes the correct basic structure of a C++ program and standard execution entry point?', options: ['void main()', 'int main() returning an integer (usually 0) to signal success', 'start() with standard entry markers', '#include <iostream> inside the main body'], correct: 1, explanation: 'Standard C++ requires `int main()` as the entry point, returning 0 to indicate successful execution.' } },
    { id: 'n2', name: 'Elara', role: 'Blacksmith', gender: 'Female', color: 0x4a4a4a, size: [1.1, 0.95, 1.1], topic: 'Unit #1: Data Types & Memory',
      dialogue: 'I need to know the exact sizes of my ores, and the exact precision of temp gauges. A tiny overflow and the forge explodes!',
      question: { text: 'In C++, which data type is typically used to store a single character, and which one is used for floating-point calculations with double precision?', options: ['string and float', 'char and double', 'int and bool', 'wchar_t and float'], correct: 1, explanation: '`char` stores a single character, while `double` has double precision (64-bit IEEE 754) for floats.' } },
    { id: 'n3', name: 'Silas', role: 'Merchant', gender: 'Male', color: 0x800080, size: [0.95, 1, 0.95], topic: 'Unit #1: Constants & Variables',
      dialogue: 'Prices fluctuate, but tax rates? They are immutable. Unless a thief breaks into the ledger and changes them...',
      question: { text: 'Which of the following successfully declares an unmodifiable decimal constant named `TAX_RATE` in C++?', options: ['constant float TAX_RATE = 0.05;', 'const double TAX_RATE = 0.05;', 'immutable TAX_RATE = 0.05;', '#define constant TAX_RATE 0.05'], correct: 1, explanation: 'The `const` keyword in C++ declares a read-only variable whose value cannot be altered.' } },
    { id: 'n4', name: 'Vael', role: 'Guard', gender: 'Female', color: 0xb22222, size: [1.05, 1.1, 1], topic: 'Unit #1: Operators & Expressions',
      dialogue: 'To grant gate access, my logical check must be infallible. Combining conditions requires absolute precision.',
      question: { text: 'What are the values of variables `x` and `y` after this expression executes: `int x = 5; int y = x++;`?', options: ['x is 6, y is 6', 'x is 5, y is 5', 'x is 6, y is 5', 'x is 5, y is 6'], correct: 2, explanation: 'The post-increment operator (`x++`) assigns the current value of `x` (5) to `y`, then increments `x` to 6.' } },
    { id: 'n5', name: 'Thorne', role: 'Doctor', gender: 'Male', color: 0x008080, size: [0.95, 1.05, 0.95], topic: 'Unit #1: Syntax & Logical Errors',
      dialogue: 'A syntax error halts compilation immediately, but a logical error? It operates in secret, like a silent plague...',
      question: { text: 'Which statement correctly distinguishes between a compilation (syntax) error and a logical error?', options: ['Syntax errors cause the program to crash at runtime; logical errors prevent compilation.', 'Syntax errors violate language grammar and prevent compilation; logical errors compile but yield incorrect behavior.', 'Both prevent compilation, but logical errors only happen during input/output operations.', 'There is no difference; they both refer to runtime exceptions.'], correct: 1, explanation: 'Syntax or compilation errors violate grammar (e.g., missing semicolons). Logical errors produce incorrect output with valid code.' } },
    { id: 'n6', name: 'Lyra', role: 'Teacher', gender: 'Female', color: 0x4682b4, size: [0.9, 0.95, 0.9], topic: 'Unit #2: Decision Structures (if/else)',
      dialogue: 'Every choice has a path. If the conditions are met, we learn. If not, we fail. The crime scene showed a bifurcated trail.',
      question: { text: 'Consider this block: `int score = 75; if (score > 80) cout << "A"; else if (score > 70) cout << "B"; else cout << "C";`. What is printed?', options: ['A', 'B', 'C', 'B and C'], correct: 1, explanation: 'Since 75 is not > 80, the first condition is false. Since 75 is > 70, the block prints "B" and bypasses the rest.' } },
    { id: 'n7', name: 'Gael', role: 'Baker', gender: 'Male', color: 0xd2b48c, size: [1.1, 1, 1.1], topic: 'Unit #2: Multiple Selection (switch)',
      dialogue: 'My baking ovens have discrete preset dials. If a dial is selected, the correct heat activates. But some cases are falling through!',
      question: { text: 'What happens in a C++ `switch` statement if a `case` matches but lacks a trailing `break` statement?', options: ['The compiler raises a fatal syntax error.', 'Execution immediately terminates and exits the switch.', 'Execution falls through to subsequent cases until a break or the end of the switch is met.', 'The default case is automatically executed regardless of match.'], correct: 2, explanation: 'Without a `break`, execution "falls through" to execute the statements of the next case sequentially.' } },
    { id: 'n8', name: 'Rowena', role: 'Librarian', gender: 'Female', color: 0x228b22, size: [1, 1, 1], topic: 'Unit #2: Conditional Operator (?:)',
      dialogue: 'Ah, the ternary conditional operator. It is the shortest path to double selection. Concise, yet elegant.',
      question: { text: 'Which expression is equivalent to: `if (a > b) max = a; else max = b;`?', options: ['max = (a > b) ? a : b;', 'max = (a > b) : a ? b;', '(a > b) ? max = b : max = a;', 'max = if (a > b) a else b;'], correct: 0, explanation: 'The conditional operator `condition ? expr1 : expr2` evaluates `expr1` if true, and `expr2` if false.' } },
    { id: 'n9', name: 'Kael', role: 'Miner', gender: 'Male', color: 0x708090, size: [1.05, 0.95, 1.05], topic: 'Unit #2: Nested Decisions',
      dialogue: 'Deep inside the mine, one passageway branches, and within that branch lies another choice. A labyrinth of conditions!',
      question: { text: 'Under what conditions will this print "Branch B"? `if (x > 10) { if (y < 5) cout << "Branch A"; else cout << "Branch B"; }`', options: ['x <= 10', 'x > 10 and y < 5', 'x > 10 and y >= 5', 'y >= 5 regardless of x'], correct: 2, explanation: 'To reach "Branch B", the outer condition `x > 10` must be true, and the inner condition `y < 5` must be false (i.e., `y >= 5`).' } },
    { id: 'n10', name: 'Mira', role: 'Mayor', gender: 'Female', color: 0xffd700, size: [1, 1.05, 1], topic: 'Unit #2: Logical Operator Precedence',
      dialogue: 'In municipal code as in C++, some operations take precedence. We must evaluate logical priority correctly.',
      question: { text: 'What is the boolean evaluation of the expression `true || false && false` in C++?', options: ['false', 'true', 'Error: ambiguous expression', 'false if evaluated left-to-right'], correct: 1, explanation: 'The logical AND (`&&`) operator has higher precedence than logical OR (`||`). So `false && false` is evaluated first (false), then `true || false` is evaluated (true).' } },
    { id: 'n11', name: 'Jorik', role: 'Scribe', gender: 'Male', color: 0x8a2be2, size: [0.95, 1, 0.95], topic: 'Unit #3: Counter Loops (for)',
      dialogue: 'I copy scrolls, index by index. Count-controlled processes require a starting scroll, an ending limit, and a step.',
      question: { text: 'How many times does this loop print the scribe status: `for (int i = 0; i <= 5; i += 2) cout << "S";`?', options: ['2 times', '3 times', '4 times', '5 times'], correct: 1, explanation: 'The loop variable `i` takes values 0, 2, and 4. When `i` becomes 6, the condition `6 <= 5` is false, running 3 times total.' } },
    { id: 'n12', name: 'Elys', role: 'Scientist', gender: 'Female', color: 0x00ced1, size: [0.95, 1.05, 0.95], topic: 'Unit #3: Conditional Loops (while)',
      dialogue: 'My experiments repeat as long as the solution is unstable. Pre-test loops guarantee we don\'t start if it is safe.',
      question: { text: 'If the condition in a standard `while` loop is false before the first iteration begins, how many times will the loop body execute?', options: ['0 times', '1 time', 'Infinitely', 'It depends on compiler settings'], correct: 0, explanation: 'A `while` loop is a pre-test loop; it checks the condition before executing. If false initially, it executes 0 times.' } },
    { id: 'n13', name: 'Doran', role: 'Gravedigger', gender: 'Male', color: 0x2f4f4f, size: [1.1, 1.1, 1.1], topic: 'Unit #3: Post-Test Loops (do/while)',
      dialogue: 'I dig graves. At least one grave must be dug regardless of whether the shift continues. A post-test loop is my style.',
      question: { text: 'What is the primary characteristic that distinguishes a `do-while` loop from a `while` loop?', options: ['It runs only when conditions are false.', 'It is guaranteed to execute its body at least once because the condition is evaluated at the end.', 'It can only be used with integer counters.', 'It consumes less memory.'], correct: 1, explanation: 'Since `do-while` is a post-test loop, the body of the loop executes once before the exit condition is evaluated.' } },
    { id: 'n14', name: 'Sybil', role: 'Architect', gender: 'Female', color: 0xda70d6, size: [1, 1.05, 1], topic: 'Unit #3: Loop Nesting',
      dialogue: 'A city design is a grid of blocks. Inner loops define columns, and outer loops define rows. A nested grid pattern.',
      question: { text: 'How many asterisks are printed by this nested loop block? `for(int r = 0; r < 3; r++) { for(int c = 0; c < 4; c++) { cout << "*"; } }`', options: ['7', '12', '9', '4'], correct: 1, explanation: 'The outer loop runs 3 times, and for each iteration, the inner loop runs 4 times. 3 * 4 = 12 total print statements.' } },
    { id: 'n15', name: 'Orin', role: 'Clockmaker', gender: 'Male', color: 0xb8860b, size: [0.95, 0.95, 0.95], topic: 'Unit #3: Loop Control (break & continue)',
      dialogue: 'Gears mesh and turn. But an emergency break halts everything immediately, while continue skips the current cog\'s teeth.',
      question: { text: 'Inside a loop, what is the precise difference between the `break` and `continue` statements?', options: ['break skips to the next iteration; continue exits the loop.', 'break terminates compilation; continue restarts the computer.', 'break exits the nearest enclosing loop completely; continue skips the rest of the current iteration and goes to the next check.', 'They are identical in loops but different in switch structures.'], correct: 2, explanation: '`break` interrupts and exits the loop immediately. `continue` skips the remaining statements in the current iteration and goes to the next evaluation/increment.' } }
];

let gameState = {
    criminalId: null,
    activeNPCs: [],
    npcTruthStatuses: {},
    npcHints: {},
    npcProgress: {},
    evidencePoints: 0,
    currentNpcId: null,
    gameActive: false,
    mapScale: 2.5,
    mapSize: 100
};

const SCAN_COST = 15;

function startGameScale(scaleType) {
    let count = 3;
    if (scaleType === 'medium') { count = 7; gameState.mapSize = 100; gameState.mapScale = 2.0; }
    else if (scaleType === 'large') { count = 15; gameState.mapSize = 160; gameState.mapScale = 1.0; }
    else { gameState.mapSize = 60; gameState.mapScale = 3.0; }

    const shuffled = [...ALL_NPCS_DATA].sort(() => 0.5 - Math.random());
    gameState.activeNPCs = shuffled.slice(0, count);

    const criminal = gameState.activeNPCs[0];
    gameState.criminalId = criminal.id;

    gameState.activeNPCs.forEach((npc, index) => {
        let status = 'Truth';
        if (npc.id === criminal.id) {
            status = 'Liar';
        } else {
            const ratios = count === 3 ? [1, 2] : count === 7 ? [3, 5] : [6, 12];
            if (index <= ratios[0]) status = 'Truth';
            else if (index <= ratios[1]) status = 'Liar';
            else status = 'Neutral';
        }
        gameState.npcTruthStatuses[npc.id] = status;

        gameState.npcProgress[npc.id] = {
            questionPassed: false,
            scanned: false,
            failedAttempts: 0
        };
    });

    generateHints(criminal);
    
    // Build World
    clearWorld();
    buildWorld(count, gameState.mapSize);
    
    environmentProgress = 0;
    gameState.gameActive = true;
    updateEvidenceDisplay();
    
    // UI Trans
    document.getElementById('scale-screen').classList.add('hidden');
    document.getElementById('main-menu').classList.remove('hidden');
}

function generateHints(criminal) {
    gameState.activeNPCs.forEach(npc => {
        const status = gameState.npcTruthStatuses[npc.id];
        let hint = '';

        const cGender = criminal.gender;
        const cRole = criminal.role;
        const opGender = cGender === 'Male' ? 'Female' : 'Male';
        const otherRoles = gameState.activeNPCs.filter(n => n.id !== criminal.id).map(n => n.role);
        const randomWrongRole = otherRoles.length > 0 ? otherRoles[Math.floor(Math.random() * otherRoles.length)] : 'Unknown';

        // Seeded random
        const r = Math.abs(npc.id.split('').reduce((a, b) => {a = ((a << 5) - a) + b.charCodeAt(0); return a&a}, 0)) % 100;

        if (r < 33) {
            if (status === 'Truth') hint = `The corruption was initiated by a ${cGender}.`;
            else if (status === 'Liar') hint = `I saw the footprint. It unmistakably belonged to a ${opGender}.`;
            else hint = `Shadows deceive. It might have been a ${cGender}, or perhaps a ${opGender}.`;
        } else if (r < 66) {
            if (status === 'Truth') hint = `Check the logs... The criminal is a ${cRole}.`;
            else if (status === 'Liar') hint = `My sources confirm the culprit is the ${randomWrongRole}.`;
            else hint = `Could it be the ${cRole}? Or the ${randomWrongRole}? Both have motives.`;
        } else {
            if (status === 'Truth') hint = `I can swear on my life, the criminal is NOT the ${randomWrongRole}.`;
            else if (status === 'Liar') hint = `Look elsewhere. The criminal is absolutely NOT the ${cRole}.`;
            else hint = `I don't deal in absolutes. But I doubt the ${randomWrongRole} is capable.`;
        }

        if (npc.id === criminal.id) {
            if (r < 50) hint = `I am being framed! You should be investigating the ${randomWrongRole}!`;
            else hint = `I was compiling code all night. Ask the ${opGender}s in the village.`;
        }

        gameState.npcHints[npc.id] = hint;
    });
}

function getNPCContext(id) {
    return gameState.activeNPCs.find(n => n.id === id);
}

// ==========================================
// AUDIO SYSTEM
// ==========================================
class AudioManager {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.lastFootstepTime = 0;
        this.ambientGain = null;
        this.muted = false; // Master volume toggle essentially
        this.settings = {
            music: document.getElementById('toggle-music').checked,
            ambience: document.getElementById('toggle-ambience').checked,
            sfx: document.getElementById('toggle-sfx').checked
        };
    }
    init() {
        if (this.initialized) {
            if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
            return;
        }
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.initialized = true;
        this.startAmbient();
        this.startMusic();
    }
    toggleMute() {
        this.muted = !this.muted;
        this.applySettings();
        return this.muted;
    }
    updateSettings() {
        this.settings.music = document.getElementById('toggle-music').checked;
        this.settings.ambience = document.getElementById('toggle-ambience').checked;
        this.settings.sfx = document.getElementById('toggle-sfx').checked;
        this.applySettings();
    }
    applySettings() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Handle Ambience volume
        if (this.ambientGain) {
            const ambVol = (this.muted || !this.settings.ambience) ? 0 : 0.2;
            this.ambientGain.gain.setValueAtTime(ambVol, now);
        }

        // Handle Music volume
        if (this.musicGainNode) {
            const musVol = (this.muted || !this.settings.music) ? 0 : 0.05;
            this.musicGainNode.gain.setValueAtTime(musVol, now);
        }
    }
    setAmbianceProgress(progress) {
        if (!this.ctx || !this.dayGain || !this.duskGain) return;
        const now = this.ctx.currentTime;
        this.dayGain.gain.setTargetAtTime(Math.max(0, 1.0 - progress), now, 0.5);
        this.duskGain.gain.setTargetAtTime(Math.max(0, progress), now, 0.5);
    }
    startMusic() {
        if (!this.ctx) return;
        
        // Gentle background drone for music
        this.musicGainNode = this.ctx.createGain();
        this.musicGainNode.gain.value = (this.muted || !this.settings.music) ? 0 : 0.05;
        this.musicGainNode.connect(this.ctx.destination);

        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 55; // Deep low drone
        
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 100;
        
        osc.connect(filter);
        filter.connect(this.musicGainNode);
        
        osc.start();
    }
    startAmbient() {
        if (!this.ctx) return;
        
        // Base Wind Noise (Shared)
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = buffer;
        noiseSrc.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 300; 

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = (this.muted || !this.settings.ambience) ? 0 : 0.2; 
        this.ambientGain = gainNode;

        noiseSrc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        noiseSrc.start();

        // Environment Gains
        this.dayGain = this.ctx.createGain();
        this.dayGain.gain.value = 1.0;
        this.dayGain.connect(gainNode);

        this.duskGain = this.ctx.createGain();
        this.duskGain.gain.value = 0.0;
        this.duskGain.connect(gainNode);

        // Random Ambient Events (Birds & Crickets)
        setInterval(() => {
            if (this.muted || !this.settings.ambience || !this.ctx) return;
            const r = Math.random();
            const now = this.ctx.currentTime;
            
            // Random Bird (Day)
            if (r < 0.5 && this.dayGain.gain.value > 0.05) {
                const bOsc = this.ctx.createOscillator();
                const bGain = this.ctx.createGain();
                bOsc.frequency.setValueAtTime(2000 + Math.random()*1000, now);
                bOsc.frequency.exponentialRampToValueAtTime(1500 + Math.random()*500, now + 0.2);
                
                bGain.gain.setValueAtTime(0, now);
                bGain.gain.linearRampToValueAtTime(0.05 + Math.random()*0.05, now + 0.05);
                bGain.gain.linearRampToValueAtTime(0, now + 0.2);
                
                bOsc.connect(bGain);
                bGain.connect(this.dayGain);
                bOsc.start(now);
                bOsc.stop(now + 0.2);
            }

            // Random Cricket Chirp (Dusk)
            if (r > 0.3 && this.duskGain.gain.value > 0.05) {
                const cOsc = this.ctx.createOscillator();
                const cGain = this.ctx.createGain();
                cOsc.type = 'square';
                cOsc.frequency.value = 4000 + Math.random() * 500;
                
                cGain.gain.setValueAtTime(0, now);
                for(let i=0; i<3; i++) {
                    const offset = now + i*0.06;
                    cGain.gain.linearRampToValueAtTime(0.01 + Math.random()*0.01, offset + 0.01);
                    cGain.gain.linearRampToValueAtTime(0, offset + 0.05);
                }
                
                const cFilter = this.ctx.createBiquadFilter();
                cFilter.type = 'bandpass';
                cFilter.frequency.value = 4500;
                cFilter.Q.value = 5;

                cOsc.connect(cGain);
                cGain.connect(cFilter);
                cFilter.connect(this.duskGain);
                
                cOsc.start(now);
                cOsc.stop(now + 0.3);
            }

            // Eerie bell (Dusk)
            if (r > 0.8 && this.duskGain.gain.value > 0.1) {
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.frequency.value = 150 + Math.random() * 50;
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 3);
                osc.connect(g);
                g.connect(this.duskGain);
                osc.start(now);
                osc.stop(now + 3);
            }
        }, 1500);
    }
    playFootstep(isOnPath = false) {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this.lastFootstepTime < 0.35) return; 
        this.lastFootstepTime = now;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        if (isOnPath) {
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
            filter.frequency.value = 400;
            gain.gain.setValueAtTime(0.04, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        } else {
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
            filter.frequency.value = 250;
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        }

        filter.type = 'lowpass';

        osc.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.15);
    }
    playInteractionBeep() {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.1);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.2);
    }
    playSuccessBeep() {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        
        // Enhance: two oscillators for a subtle chime chord
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        
        // Major third interval for a positive feel
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(659.25, now); // E5

        // Slight detune for richness
        osc2.detune.value = 5;

        // Subtle lowpass to make it soft
        filter.type = 'lowpass';
        filter.frequency.value = 2000;

        // Gentle envelope
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.8);
        osc2.stop(now + 0.8);
    }
    playErrorBeep() {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.setValueAtTime(100, now + 0.2);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.3);
    }
    playPaperFlip() {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        const duration = 0.25;

        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noiseNode = this.ctx.createBufferSource();
        noiseNode.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1000;
        filter.Q.value = 1.0;

        const gainNode = this.ctx.createGain();
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

        noiseNode.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);

        noiseNode.start(now);
    }
    playBirdChirp(dist = 10) {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(3000, now);
        osc.frequency.exponentialRampToValueAtTime(4000, now + 0.1);
        osc.frequency.exponentialRampToValueAtTime(2500, now + 0.2);
        
        let targetVolume = 0.05 * (1 - Math.min(dist/40, 1));
        if (targetVolume < 0.001) targetVolume = 0.001;
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(targetVolume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}
const audio = new AudioManager();

// ==========================================
// UI & DOM
// ==========================================
const ui = {
    welcomeScreen: document.getElementById('welcome-screen'),
    welcomeContinueBtn: document.getElementById('welcome-continue-btn'),
    scaleScreen: document.getElementById('scale-screen'),
    mainMenu: document.getElementById('main-menu'),
    hud: document.getElementById('hud'),
    dialogueScreen: document.getElementById('dialogue-screen'),
    notebookScreen: document.getElementById('notebook-screen'),
    kbScreen: document.getElementById('kb-screen'),
    accusationScreen: document.getElementById('accusation-screen'),
    endScreen: document.getElementById('end-screen'),
    
    startBtn: document.getElementById('start-btn'),
    interactPrompt: document.getElementById('interaction-prompt'),
    evidenceDisplay: document.getElementById('evidence-display'),
    
    npcName: document.getElementById('npc-name'),
    npcRole: document.getElementById('npc-role'),
    npcDialogue: document.getElementById('npc-dialogue'),
    qContainer: document.getElementById('question-container'),
    qTopic: document.getElementById('question-topic'),
    qText: document.getElementById('question-text'),
    qOptions: document.getElementById('question-options'),
    fContainer: document.getElementById('feedback-container'),
    fText: document.getElementById('feedback-text'),
    fExp: document.getElementById('feedback-explanation'),
    nextBtn: document.getElementById('next-btn'),
    buyHintBtn: document.getElementById('buy-hint-btn'),
    hContainer: document.getElementById('hint-container'),
    hText: document.getElementById('hint-text'),
    leaveBtn: document.getElementById('leave-btn'),
    
    notebookGrid: document.getElementById('notebook-grid'),
    notebookPts: document.getElementById('notebook-pts'),
    kbBtn: document.getElementById('kb-btn'),
    closeKbBtn: document.getElementById('close-kb-btn'),
    resumeBtn: document.getElementById('resume-btn'),
    accuseBtn: document.getElementById('accuse-btn'),
    suspectsGrid: document.getElementById('suspects-grid'),
    cancelAccuseBtn: document.getElementById('cancel-accuse-btn'),
    endTitle: document.getElementById('end-title'),
    endDesc: document.getElementById('end-desc'),
    restartBtn: document.getElementById('restart-btn'),
    minimap: document.getElementById('minimap'),
    audioToggleBtn: document.getElementById('global-audio-toggle'),
    
    settingsScreen: document.getElementById('settings-screen'),
    closeSettingsBtn: document.getElementById('close-settings-btn'),
    toggleMusic: document.getElementById('toggle-music'),
    toggleAmbience: document.getElementById('toggle-ambience'),
    toggleSfx: document.getElementById('toggle-sfx'),

    gameTooltip: document.getElementById('game-tooltip'),
    tooltipTitle: document.getElementById('tooltip-title'),
    tooltipText: document.getElementById('tooltip-text'),
    
    playerEmote: document.getElementById('player-emote'),
    emoteIcon: document.getElementById('emote-icon'),
    emoteText: document.getElementById('emote-text')
};

function hideAllScreens() {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
}
function updateEvidenceDisplay(animate = false) {
    const oldPts = parseInt(ui.evidenceDisplay.textContent) || 0;
    ui.evidenceDisplay.textContent = gameState.evidencePoints;
    ui.notebookPts.textContent = gameState.evidencePoints;
    
    if (animate && gameState.evidencePoints > oldPts) {
        ui.evidenceDisplay.classList.remove('bump-anim');
        void ui.evidenceDisplay.offsetWidth; // trigger reflow
        ui.evidenceDisplay.classList.add('bump-anim');
    }
}

// Typewriter effect
let typeWriterTimeout = null;
function typeText(element, text, speed = 20) {
    if (typeWriterTimeout) clearTimeout(typeWriterTimeout);
    element.textContent = "";
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            typeWriterTimeout = setTimeout(type, speed);
        }
    }
    type();
}


ui.audioToggleBtn.addEventListener('click', () => {
    audio.init();
    ui.settingsScreen.classList.remove('hidden');
    controls.unlock();
});

ui.closeSettingsBtn.addEventListener('click', () => {
    ui.settingsScreen.classList.add('hidden');
    if (gameState.gameActive && ui.dialogueScreen.classList.contains('hidden') && ui.notebookScreen.classList.contains('hidden') && ui.kbScreen.classList.contains('hidden') && ui.accusationScreen.classList.contains('hidden')) {
        controls.lock();
    }
});

ui.toggleMusic.addEventListener('change', () => audio.updateSettings());
ui.toggleAmbience.addEventListener('change', () => audio.updateSettings());
ui.toggleSfx.addEventListener('change', () => audio.updateSettings());

// ==========================================
// INITIAL SETUP logic
// ==========================================
ui.welcomeContinueBtn.disabled = true;
ui.welcomeContinueBtn.textContent = 'Wait...';
setTimeout(() => {
    ui.welcomeContinueBtn.disabled = false;
    ui.welcomeContinueBtn.textContent = 'Continue';
}, 3000);

ui.welcomeContinueBtn.addEventListener('click', () => {
    audio.init(); 
    audio.playInteractionBeep();
    hideAllScreens();
    ui.scaleScreen.classList.remove('hidden');
});

document.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        audio.playInteractionBeep();
        startGameScale(btn.getAttribute('data-scale'));
    });
});

ui.startBtn.addEventListener('click', () => {
    audio.playInteractionBeep();
    hideAllScreens();
    ui.hud.classList.remove('hidden');
    controls.lock();
});

// ==========================================
// THREE.JS SETUP & WORLD GEN
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f172a); 
scene.fog = new THREE.FogExp2(0x0f172a, 0.025);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);

// First Person Arms Setup
const playerArmGroup = new THREE.Group();
camera.add(playerArmGroup);
scene.add(camera); // Camera must be in scene for children to render

const armGeo = new THREE.CylinderGeometry(0.04, 0.03, 0.6);
const armMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 }); // Dark sleeve color
const handGeo = new THREE.SphereGeometry(0.05);
const handMat = new THREE.MeshStandardMaterial({ color: 0xfca5a5, roughness: 0.5 }); // Skin tone

// Right Arm
const rightArmBase = new THREE.Group();
rightArmBase.position.set(0.25, -0.25, -0.2);
const rightArmMesh = new THREE.Mesh(armGeo, armMat);
rightArmMesh.position.set(0, 0, -0.3);
rightArmMesh.rotation.x = Math.PI / 2;
const rightHandMesh = new THREE.Mesh(handGeo, handMat);
rightHandMesh.position.set(0, -0.35, 0);
rightArmMesh.add(rightHandMesh);
rightArmBase.add(rightArmMesh);
playerArmGroup.add(rightArmBase);

// Left Arm
const leftArmBase = new THREE.Group();
leftArmBase.position.set(-0.25, -0.25, -0.2);
const leftArmMesh = new THREE.Mesh(armGeo, armMat);
leftArmMesh.position.set(0, 0, -0.3);
leftArmMesh.rotation.x = Math.PI / 2;
const leftHandMesh = new THREE.Mesh(handGeo, handMat);
leftHandMesh.position.set(0, -0.35, 0);
leftArmMesh.add(leftHandMesh);
leftArmBase.add(leftArmMesh);
playerArmGroup.add(leftArmBase);

// Hide arms initially by pulling them down
rightArmBase.position.y = -0.8;
leftArmBase.position.y = -0.8;
let currentEmote = null;
let emoteAnimationTimer = 0;

// Lighting (Time of Day system)
const colorSkyAfternoon = new THREE.Color(0x94a3b8);
const colorSkyDusk = new THREE.Color(0x0f172a);

const colorSunAfternoon = new THREE.Color(0xfff5e6); // Warmer, more gold sun
const colorSunDusk = new THREE.Color(0x4f46e5);

const colorAmbAfternoon = new THREE.Color(0xd1d5db); // Less blue, warmer ambient
const colorAmbDusk = new THREE.Color(0x334155);

const sunPosAfternoon = new THREE.Vector3(80, 70, 50); // Higher sun
const sunPosDusk = new THREE.Vector3(-50, 15, -30);

let environmentProgress = 0;

const ambientLight = new THREE.AmbientLight(colorAmbAfternoon, 0.8); // Brighter
scene.add(ambientLight);

let dirLightColor = new THREE.Color().copy(colorSunAfternoon);
let dirLightIntensity = 1.5; // Stronger direction light

const csm = new CSM({
    maxFar: 150,
    cascades: 4,
    mode: 'practical',
    parent: scene,
    shadowMapSize: 2048,
    lightDirection: new THREE.Vector3().copy(sunPosAfternoon).negate().normalize(),
    camera: camera,
    lightIntensity: dirLightIntensity
});
csm.lights.forEach(light => light.color.copy(dirLightColor));

const fillLight = new THREE.DirectionalLight(0x334155, 0.5);
fillLight.position.set(-50, 20, -50);
scene.add(fillLight);

let collidables = [];
let npcMeshes = [];
let clutterMeshes = [];
let buildMeshes = [];
let staticMeshes = [];
let activeParticles = [];
let activeBirds = [];
let weatherMesh = null;
let pathIndicators = [];

function spawnPathIndicators(mapSize) {
    const geo = new THREE.SphereGeometry(0.15, 8, 8);
    const mat = new THREE.MeshBasicMaterial({ color: 0x93c5fd, transparent: true, opacity: 0.8 });
    
    // We place them along the main paths (axes)
    const steps = 10;
    const halfMap = mapSize / 2;
    const spacing = halfMap / steps;
    
    for (let i = 1; i < steps; i++) {
        // Positive and negative X
        createIndicator(i * spacing, 0, geo, mat);
        createIndicator(-i * spacing, 0, geo, mat);
        // Positive and negative Z
        createIndicator(0, i * spacing, geo, mat);
        createIndicator(0, -i * spacing, geo, mat);
        
        // Also a few diagonal ones to point to the outskirts randomly
        createIndicator(i * spacing * 0.7, i * spacing * 0.7, geo, mat);
        createIndicator(-i * spacing * 0.7, -i * spacing * 0.7, geo, mat);
        createIndicator(i * spacing * 0.7, -i * spacing * 0.7, geo, mat);
        createIndicator(-i * spacing * 0.7, i * spacing * 0.7, geo, mat);
    }
}

function createIndicator(x, z, geo, mat) {
    const mesh = new THREE.Mesh(geo, mat);
    const y = getTerrainHeight(x, z) + 0.5;
    mesh.position.set(x, y, z);
    mesh.userData = { baseY: y, animOffset: Math.random() * Math.PI * 2 };
    
    // add small point light
    const light = new THREE.PointLight(0x93c5fd, 0.4, 3);
    mesh.add(light);
    
    scene.add(mesh);
    pathIndicators.push(mesh);
}

let weatherVelocities = null;

let screenShakeMagnitude = 0;
let currentShakeOffset = new THREE.Vector3();

// Trigger a camera shake effect with given magnitude 
function triggerCameraShake(magnitude = 0.5) {
    screenShakeMagnitude = magnitude;
}

function spawnClueParticles(npcId) {
    const mesh = npcMeshes.find(m => m.userData.id === npcId);
    if (!mesh) return;

    const count = 40;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];
    const colors = new Float32Array(count * 3);
    const color = new THREE.Color(0xfacc15); // Yellow

    for (let i = 0; i < count; i++) {
        // start slightly above NPC
        positions[i * 3] = mesh.position.x;
        positions[i * 3 + 1] = mesh.position.y + 1;
        positions[i * 3 + 2] = mesh.position.z;

        velocities.push({
            x: (Math.random() - 0.5) * 5,
            y: Math.random() * 5 + 3,
            z: (Math.random() - 0.5) * 5
        });

        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.2,
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    activeParticles.push({
        mesh: points,
        velocities: velocities,
        life: 1.0
    });
}

function getTerrainHeight(x, z) {
    const distToPathX = Math.max(0, Math.abs(z) - 8);
    const distToPathZ = Math.max(0, Math.abs(x) - 8);
    const dist = Math.min(distToPathX, distToPathZ);
    
    // Flat area near paths
    const flatDist = 15;
    if (dist <= flatDist) return 0;
    
    // Smooth transition from flat to hills
    const fadeDist = dist - flatDist;
    const fade = Math.min(1, fadeDist / 20);
    const smoothFade = fade * fade * (3 - 2 * fade);
    
    // Multilayered Simplex noise for varied hills
    let noise = 0;
    let amplitude = 4.0;
    let frequency = 0.03;
    
    noise += noise2D(x * frequency, z * frequency) * amplitude;
    noise += noise2D(x * frequency * 2, z * frequency * 2) * (amplitude * 0.5);
    noise += noise2D(x * frequency * 4, z * frequency * 4) * (amplitude * 0.25);
    
    // Base elevation shifts it to mostly positive hills
    noise += 2.0; 
                  
    return noise * smoothFade;
}

function clearWorld() {
    buildMeshes.forEach(m => scene.remove(m));
    staticMeshes.forEach(m => scene.remove(m));
    npcMeshes.forEach(m => scene.remove(m));
    clutterMeshes.forEach(m => scene.remove(m));
    activeParticles.forEach(p => scene.remove(p.mesh));
    activeBirds.forEach(b => scene.remove(b));
    pathIndicators.forEach(p => scene.remove(p));
    if (weatherMesh) {
        scene.remove(weatherMesh);
        weatherMesh.geometry.dispose();
        weatherMesh.material.dispose();
        weatherMesh = null;
    }
    
    buildMeshes = [];
    staticMeshes = [];
    npcMeshes = [];
    clutterMeshes = [];
    collidables = [];
    activeParticles = [];
    activeBirds = [];
    pathIndicators = [];
}

function buildWorld(numHouses, size) {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(size*2, size*2, 128, 128);
    const pos = floorGeo.attributes.position.array;
    for (let i = 0; i < pos.length; i += 3) {
        const vx = pos[i];
        const vy = pos[i + 1];
        const vz = -vy; 
        pos[i + 2] = getTerrainHeight(vx, vz);
    }
    floorGeo.computeVertexNormals();
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9, flatShading: true });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    staticMeshes.push(floor);

    // Paths (Cross layout)
    const pathGeo = new THREE.PlaneGeometry(size*2, 8);
    const pathMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 1 });
    const p1 = new THREE.Mesh(pathGeo, pathMat); p1.rotation.x = -Math.PI/2; p1.position.y=0.01; p1.receiveShadow=true;
    const p2 = new THREE.Mesh(pathGeo, pathMat); p2.rotation.x = -Math.PI/2; p2.rotation.z = Math.PI/2; p2.position.y=0.01; p2.receiveShadow=true;
    scene.add(p1, p2); staticMeshes.push(p1, p2);

    // Path Indicators
    spawnPathIndicators(size);

    // Generate Houses
    const housePositions = [];
    const spread = size * 0.4;
    for(let i=0; i<numHouses; i++) {
        let hx = (Math.random() - 0.5) * spread * 2;
        let hz = (Math.random() - 0.5) * spread * 2;
        // Keep away from center origin and strictly paths
        if(Math.abs(hx) < 8) hx = hx > 0 ? hx + 8 : hx - 8;
        if(Math.abs(hz) < 8) hz = hz > 0 ? hz + 8 : hz - 8;
        
        buildHouse(hx, hz, 6 + Math.random()*3, 6 + Math.random()*3, 4 + Math.random()*2, i === 0);
        housePositions.push({x: hx, z: hz});
    }

    // Generate Trees, Bushes & Decorations
    const treeGeo = new THREE.CylinderGeometry(0.25, 0.6, 2.5);
    const leavesGeo = new THREE.IcosahedronGeometry(2); // More natural shape
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x166534, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x57534e });
    
    // Bush Geometry
    const bushGeo = new THREE.SphereGeometry(0.8, 8, 8);
    const bushMat = new THREE.MeshStandardMaterial({ color: 0x15803d, flatShading: true });
    
    for(let i=0; i<numHouses * 8; i++) { // More objects
        let x = (Math.random() - 0.5) * size;
        let z = (Math.random() - 0.5) * size;
        if(Math.abs(x) < 6 || Math.abs(z) < 6) continue;
        
        const y = getTerrainHeight(x, z);

        if(Math.random() < 0.6) { // Tree
            const grp = new THREE.Group();
            const trunk = new THREE.Mesh(treeGeo, trunkMat); trunk.position.y = 1.25; trunk.castShadow=true;
            const leaves = new THREE.Mesh(leavesGeo, leafMat); leaves.position.y = 3.5; leaves.scale.set(1, 1.2, 1); leaves.castShadow=true;
            grp.add(trunk, leaves);
            grp.position.set(x, y, z);
            scene.add(grp); staticMeshes.push(grp);
            collidables.push(new THREE.Box3().setFromObject(grp));
        } else { // Bush
            const bush = new THREE.Mesh(bushGeo, bushMat);
            bush.position.set(x, y + 0.4, z);
            bush.castShadow = true;
            scene.add(bush); staticMeshes.push(bush);
        }
    }

    createNPCs(housePositions, size);
    
    scene.traverse((child) => {
        if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
            csm.setupMaterial(child.material);
        }
    });

    const camStartY = getTerrainHeight(0, 0) + 1.8;
    camera.position.set(0, camStartY, 0);
    spawnBirds(25);
    spawnWeather();
}

function spawnBirds(count) {
    const birdGeo = new THREE.ConeGeometry(0.15, 0.4, 4);
    birdGeo.rotateX(Math.PI / 2); // Point forward
    const birdMat = new THREE.MeshBasicMaterial({ color: 0x0f172a }); // dark bird shape

    for(let i=0; i<count; i++) {
        const mesh = new THREE.Mesh(birdGeo, birdMat);
        mesh.position.set(
            (Math.random() - 0.5) * gameState.mapSize * 2,
            getTerrainHeight(0,0) + 12 + Math.random() * 8, // Fixed height high in air
            (Math.random() - 0.5) * gameState.mapSize * 2
        );
        mesh.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 5,
                (Math.random() - 0.2) * 1.5,
                (Math.random() - 0.5) * 5
            ).normalize().multiplyScalar(5 + Math.random() * 4), 
            animOffset: Math.random() * Math.PI * 2,
            chirpTimer: Math.random() * 10
        };
        const target = mesh.position.clone().add(mesh.userData.velocity);
        mesh.lookAt(target);
        
        scene.add(mesh);
        activeBirds.push(mesh);
    }
}

function spawnWeather() {
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    weatherVelocities = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * gameState.mapSize * 2.5; 
        positions[i * 3 + 1] = Math.random() * 40; 
        positions[i * 3 + 2] = (Math.random() - 0.5) * gameState.mapSize * 2.5; 
        
        weatherVelocities[i * 3] = (Math.random() - 0.5) * 2;
        weatherVelocities[i * 3 + 1] = -(Math.random() * 8 + 8); 
        weatherVelocities[i * 3 + 2] = (Math.random() - 0.5) * 2;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.1,
        transparent: true,
        opacity: 0.4,
        depthWrite: false
    });
    
    weatherMesh = new THREE.Points(geometry, material);
    scene.add(weatherMesh);
}

function updateWeather(delta, envProgress) {
    if (!weatherMesh) return;
    
    let weatherMode = document.getElementById('weather-select').value;
    
    if (weatherMode === 'clear') {
        weatherMesh.visible = false;
        return;
    } else {
        weatherMesh.visible = true;
    }
    
    let effProgress = envProgress;
    if (weatherMode === 'rainy') effProgress = 0.0;
    if (weatherMode === 'snowy') effProgress = 1.0;
    
    const isSnowing = effProgress > 0.5;
    const size = THREE.MathUtils.lerp(0.1, 0.4, effProgress);
    const opacity = THREE.MathUtils.lerp(0.3, 0.6, effProgress);
    
    weatherMesh.material.size = size;
    weatherMesh.material.opacity = opacity;
    // Tinge rain blueish, snow white
    weatherMesh.material.color.lerpColors(new THREE.Color(0xbadeff), new THREE.Color(0xffffff), effProgress);
    
    const positions = weatherMesh.geometry.attributes.position.array;
    for (let i = 0; i < positions.length / 3; i++) {
        const vx = weatherVelocities[i * 3];
        const vy = weatherVelocities[i * 3 + 1];
        const vz = weatherVelocities[i * 3 + 2];
        
        const speedScale = THREE.MathUtils.lerp(1.0, 0.2, effProgress); 
        
        const drift = Math.sin(performance.now() * 0.0005 + positions[i*3+1] * 0.1) * speedScale;
        
        positions[i * 3] += (vx + drift) * delta;
        positions[i * 3 + 1] += vy * speedScale * delta;
        positions[i * 3 + 2] += vz * delta;
        
        if (positions[i * 3 + 1] < 0) {
            positions[i * 3 + 1] = 40; 
            positions[i * 3] = camera.position.x + (Math.random() - 0.5) * 60; 
            positions[i * 3 + 2] = camera.position.z + (Math.random() - 0.5) * 60;
        }
    }
    weatherMesh.geometry.attributes.position.needsUpdate = true;
}

function updatePathIndicators(time) {
    pathIndicators.forEach(mesh => {
        mesh.position.y = mesh.userData.baseY + Math.sin(time * 2 + mesh.userData.animOffset) * 0.15;
        // pulse light intensity
        if (mesh.children.length > 0) {
            mesh.children[0].intensity = 0.3 + Math.sin(time * 3 + mesh.userData.animOffset) * 0.1;
        }
    });
}

function updateClutter(time) {
    clutterMeshes.forEach(mesh => {
        if (mesh.userData.isLantern && mesh.children.length > 0) {
            const light = mesh.children[0];
            light.intensity = 0.5 + Math.sin(time * 15 + mesh.userData.animOffset) * 0.1 + Math.random() * 0.05;
        }
    });
}

function updatePlayerArms(delta) {
    if (currentEmote !== null) {
        emoteAnimationTimer += delta;
        const t = emoteAnimationTimer;
        
        // Bring arms up smoothly
        const targetY = -0.2;
        rightArmBase.position.y = THREE.MathUtils.lerp(rightArmBase.position.y, targetY, delta * 10);
        leftArmBase.position.y = THREE.MathUtils.lerp(leftArmBase.position.y, targetY, delta * 10);
        
        // Emote specific animations
        if (currentEmote === 1) { // Waving
            rightArmBase.rotation.z = Math.sin(t * 15) * 0.5 + 0.5;
            rightArmBase.rotation.x = Math.sin(t * 5) * 0.2;
            leftArmBase.rotation.set(0, 0, 0); // idle
        } else if (currentEmote === 2) { // Pointing
            rightArmBase.rotation.x = -Math.PI / 4;
            rightArmBase.position.y = THREE.MathUtils.lerp(rightArmBase.position.y, -0.1, delta * 10);
            leftArmBase.rotation.set(0, 0, 0);
        } else if (currentEmote === 3) { // Thinking
            rightArmBase.rotation.z = Math.PI / 4;
            rightArmBase.rotation.x = Math.sin(t * 2) * 0.1;
            leftArmBase.rotation.set(0, 0, 0);
        } else if (currentEmote === 4) { // Nodding
            // Make both arms gesture open slightly
            rightArmBase.rotation.z = 0.2;
            leftArmBase.rotation.z = -0.2;
            rightArmBase.rotation.x = Math.sin(t * 8) * 0.1;
            leftArmBase.rotation.x = Math.sin(t * 8) * 0.1;
        }
    } else {
        // Bring arms down when no emote is active
        const targetY = -0.8;
        rightArmBase.position.y = THREE.MathUtils.lerp(rightArmBase.position.y, targetY, delta * 10);
        leftArmBase.position.y = THREE.MathUtils.lerp(leftArmBase.position.y, targetY, delta * 10);
        
        // Add subtle breathing/bobbing to rotation when moving
        const speed = velocity.length();
        let bobbing = 0;
        if (speed > 0.1 && !controls.isLocked) bobbing = 0; // stop bobbing if unlocked
        else if (speed > 0.1) bobbing = Math.sin(performance.now() * 0.01) * 0.05;
        
        rightArmBase.rotation.set(bobbing, 0, 0);
        leftArmBase.rotation.set(-bobbing, 0, 0);
    }
}

function updateBirds(delta, time) {
    activeBirds.forEach(bird => {
        bird.position.addScaledVector(bird.userData.velocity, delta);
        bird.position.y += Math.sin(time * 8 + bird.userData.animOffset) * 0.05;
        
        const mapLimit = gameState.mapSize;
        if (bird.position.x > mapLimit) bird.position.x = -mapLimit;
        if (bird.position.x < -mapLimit) bird.position.x = mapLimit;
        if (bird.position.z > mapLimit) bird.position.z = -mapLimit;
        if (bird.position.z < -mapLimit) bird.position.z = mapLimit;
        
        // Slightly change direction over time
        bird.userData.velocity.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.sin(time / 2 + bird.userData.animOffset) * delta * 0.5);
        const target = bird.position.clone().add(bird.userData.velocity);
        bird.lookAt(target);

        bird.userData.chirpTimer -= delta;
        if (bird.userData.chirpTimer <= 0) {
            const dist = camera.position.distanceTo(bird.position);
            if (dist < 50) {
                audio.playBirdChirp(dist);
            }
            bird.userData.chirpTimer = 6 + Math.random() * 15;
        }
    });
}

const clutterFlavorTexts = [
    "An old wooden barrel. Smells like salted fish.",
    "A sturdy crate marked: 'Do not open - Mayor's Property'.",
    "Empty sack of grains. Mice have chewed through it.",
    "A rusted lantern. Someone left in a hurry.",
    "A pile of chopped wood, dry and ready for winter.",
    "Some strange discarded tools. You can't decipher their use."
];

function spawnClutter(x, z, houseW, houseD) {
    if(Math.random() < 0.4) return; // 60% chance for a house to have clutter

    const isBarrel = Math.random() < 0.5;
    const isLantern = Math.random() < 0.2; // small chance for a standalone lantern
    
    let geo, mat;
    if (isLantern) {
        geo = new THREE.CylinderGeometry(0.15, 0.2, 0.6, 6);
        mat = new THREE.MeshStandardMaterial({ color: 0xca8a04, emissive: 0xb45309, emissiveIntensity: 0.5 });
    } else if(isBarrel) {
        geo = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
        mat = new THREE.MeshStandardMaterial({ color: 0x5c4033, roughness: 1.0 });
    } else {
        geo = new THREE.BoxGeometry(1, 1, 1);
        mat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9, map: new THREE.CanvasTexture(createCrateTexture()) });
    }
    
    // We add multiple pieces sometimes
    const numClutter = 1 + Math.floor(Math.random() * 3);
    for(let i=0; i<numClutter; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        
        // Find a spot near the house (adjusting for rotation)
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.max(houseW, houseD) / 2 + 1.0 + Math.random() * 2.0;
        
        const cx = x + Math.cos(angle) * dist;
        const cz = z + Math.sin(angle) * dist;
        const cy = getTerrainHeight(cx, cz) + (isLantern ? 0.3 : (isBarrel ? 0.6 : 0.5));
        
        mesh.position.set(cx, cy, cz);
        
        if (!isBarrel && !isLantern) {
            mesh.rotation.y = Math.random() * Math.PI;
        }

        mesh.castShadow = true;
        mesh.receiveShadow = true;

        mesh.userData = {
            isClutter: true,
            isHeavy: !isLantern,
            flavorText: clutterFlavorTexts[Math.floor(Math.random() * clutterFlavorTexts.length)]
        };

        if (isLantern) {
            mesh.userData.flavorText = "A flickering lantern... It brings a tiny sliver of hope.";
            const light = new THREE.PointLight(0xfef08a, 0.5, 4);
            light.position.y = 0.4;
            mesh.add(light);
            // We use animation for flickering
            mesh.userData.isLantern = true;
            mesh.userData.animOffset = Math.random() * 100;
        }

        scene.add(mesh);
        clutterMeshes.push(mesh);
        collidables.push(new THREE.Box3().setFromObject(mesh));
    }
}

function createCrateTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0,0,64,64);
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 4;
    ctx.strokeRect(4,4,56,56);
    ctx.beginPath();
    ctx.moveTo(4,4); ctx.lineTo(60,60);
    ctx.moveTo(60,4); ctx.lineTo(4,60);
    ctx.stroke();
    return canvas;
}

function buildHouse(x, z, w, d, h, hasSignboard = false) {
    const group = new THREE.Group();
    
    // Vary colors
    const colors = [0x78350f, 0x4f46e5, 0x991b1b, 0x166534, 0x1e293b];
    const baseColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Base
    const baseMat = new THREE.MeshStandardMaterial({ color: baseColor, roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), baseMat);
    base.position.y = h/2;
    base.castShadow = true; base.receiveShadow = true;
    group.add(base);

    // Roof - varied heights
    const roofH = h * (0.5 + Math.random() * 0.3);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*0.75, roofH, 4), roofMat);
    roof.position.y = h + roofH/2;
    roof.rotation.y = Math.PI/4;
    roof.castShadow = true; roof.receiveShadow = true;
    group.add(roof);

    // Chimney (randomly)
    if(Math.random() < 0.5) {
        const chimneyMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        const chimney = new THREE.Mesh(new THREE.BoxGeometry(w*0.2, h*0.4, d*0.2), chimneyMat);
        chimney.position.set(w*0.3, h + roofH*0.5, 0);
        chimney.castShadow = true;
        group.add(chimney);
    }

    // Door
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x171717 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(w*0.25, h*0.5, d+0.1), doorMat);
    door.position.set(0, (h*0.5)/2, d/2);
    group.add(door);

    // Windows (Glowing)
    const winMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xb45309, emissiveIntensity: 0.8 });
    const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(w*0.2, h*0.2, d+0.2), winMat);
    windowMesh.position.set(-w*0.2, h*0.6, d/2);
    group.add(windowMesh);
    const windowMesh2 = new THREE.Mesh(new THREE.BoxGeometry(w*0.2, h*0.2, d+0.2), winMat);
    windowMesh2.position.set(w*0.2, h*0.6, d/2);
    group.add(windowMesh2);

    if (hasSignboard) {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = '#1e293b'; 
        ctx.fillRect(0, 0, 1024, 1024);
        
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 20;
        ctx.strokeRect(20, 20, 984, 984);
        
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 85px Cinzel';
        ctx.textAlign = 'center';
        ctx.fillText('CREATED BY', 512, 180);
        ctx.fillText('ZEESHAN KHAN', 512, 280);
        
        ctx.fillStyle = '#818cf8';
        ctx.font = 'bold 65px Inter';
        ctx.letterSpacing = '10px';
        ctx.fillText('HIS FIRST GAME', 512, 450);
        
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '45px Inter';
        ctx.letterSpacing = '0px';
        ctx.fillText('He loves discovering new things', 512, 600);
        ctx.fillText('and building tools, websites,', 512, 670);
        ctx.fillText('and creative projects.', 512, 740);
        
        const signTexture = new THREE.CanvasTexture(canvas);
        signTexture.anisotropy = 16;
        const signMat = new THREE.MeshStandardMaterial({ map: signTexture, roughness: 0.6 });
        const signMesh = new THREE.Mesh(new THREE.PlaneGeometry(w*0.8, w*0.8), signMat);
        // Place on the back wall of the house to be seen
        signMesh.position.set(0, h*0.45, -d/2 - 0.05);
        signMesh.rotation.y = Math.PI;
        group.add(signMesh);
    }

    group.position.set(x, getTerrainHeight(x, z), z);
    group.rotation.y = (Math.floor(Math.random()*4)) * (Math.PI/2);
    
    scene.add(group);
    buildMeshes.push(group);
    collidables.push(new THREE.Box3().setFromObject(group));

    spawnClutter(x, z, w, d);
}

function createNPCs(housePosList, mapSize) {
    gameState.activeNPCs.forEach((n, i) => {
        const group = new THREE.Group();
        const sw = n.size[0], sh = n.size[1], sd = n.size[2];

        // Core dimensions
        const tw = 0.8 * sw, th = 1.2 * sh, td = 0.4 * sd;
        const hw = 0.5 * sw, hh = 0.5 * sh, hd = 0.5 * sd;

        // Custom skins & hair palettes based on role to create visual depth
        let skinHex = 0xffedd5; // default fair
        let hairHex = 0x221c17; // default dark
        let outfitHex = n.color;

        if (n.role === 'Farmer' || n.role === 'Miner' || n.role === 'Gravedigger' || n.role === 'Baker') {
            skinHex = 0xe0a96d; // warm tanned/sun-kissed skin
        } else if (n.role === 'Mayor' || n.role === 'Teacher' || n.role === 'Librarian') {
            skinHex = 0xffe4e6; // rose-ivory
        }

        if (n.role === 'Blacksmith') {
            hairHex = 0x7c2d12; // reddish brown
        } else if (n.role === 'Doctor' || n.role === 'Clockmaker') {
            hairHex = 0x78716c; // grey/silver hair
        } else if (n.role === 'Mayor') {
            hairHex = 0x1d4ed8; // rich dynamic blue hair for high contrast
        }

        const bodyMat = new THREE.MeshStandardMaterial({ color: outfitHex, roughness: 0.8 });
        const skinMat = new THREE.MeshStandardMaterial({ color: skinHex, roughness: 0.9 });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
        const hairMat = new THREE.MeshStandardMaterial({ color: hairHex, roughness: 0.9 });

        // Accessory materials
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.2 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3, metalness: 0.5 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4, roughness: 0.2 });
        const leatherMat = new THREE.MeshStandardMaterial({ color: 0x7c2d12, roughness: 0.9 });
        const steelMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4, metalness: 0.7 });
        const plumeMat = new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.8 });

        // ==========================================
        // 1. TORSO (Body structure)
        // ==========================================
        const torso = new THREE.Mesh(new THREE.BoxGeometry(tw, th, td), bodyMat);
        torso.position.y = 1.6 * sh;
        torso.castShadow = true;
        torso.receiveShadow = true;
        group.add(torso);

        // Torso Details (Buttons, suspenders, aprons)
        if (n.role === 'Blacksmith') {
            // Leather blacksmith apron (Matches woodcutter/blacksmith brown leather chest shield)
            const apron = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.85, th * 0.9, 0.05 * sd), leatherMat);
            apron.position.set(0, -0.05 * th, td / 2 + 0.01 * sd);
            apron.castShadow = true;
            torso.add(apron);

            // Straps
            const strapL = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.12, th * 0.4, 0.06 * sd), darkMat);
            strapL.position.set(-tw * 0.3, th * 0.35, td / 2 + 0.01 * sd);
            const strapR = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.12, th * 0.4, 0.06 * sd), darkMat);
            strapR.position.set(tw * 0.3, th * 0.35, td / 2 + 0.01 * sd);
            torso.add(strapL, strapR);
        } else if (n.role === 'Baker') {
            // Baker/Chef apron (clean white)
            const apron = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.85, th * 0.82, 0.04 * sd), whiteMat);
            apron.position.set(0, -0.08 * th, td / 2 + 0.01 * sd);
            apron.castShadow = true;
            torso.add(apron);
        } else if (n.role === 'Guard') {
            // Heavy steel chest armor chestplate
            const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(tw * 1.05, th * 0.95, td * 1.15), steelMat);
            chestPlate.position.set(0, 0, 0);
            chestPlate.castShadow = true;
            torso.add(chestPlate);

            // Gold/Bronze Shoulder Guards/Pauldrons
            const pauldronL = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.25, th * 0.25, td * 1.25), goldMat);
            pauldronL.position.set(-tw * 0.58, th * 0.4, 0);
            const pauldronR = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.25, th * 0.25, td * 1.25), goldMat);
            pauldronR.position.set(tw * 0.58, th * 0.4, 0);
            torso.add(pauldronL, pauldronR);
        } else if (n.role === 'Mayor') {
            // Elegant gold sash / collar band
            const sash = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.25, th * 1.05, td * 1.1), goldMat);
            sash.position.set(0, 0, 0);
            sash.rotation.z = Math.PI / 6;
            torso.add(sash);
        } else {
            // Standard suspenders or buttons
            const button1 = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.1, tw * 0.1, 0.03 * sd), whiteMat);
            button1.position.set(0, th * 0.2, td / 2 + 0.01 * sd);
            const button2 = new THREE.Mesh(new THREE.BoxGeometry(tw * 0.1, tw * 0.1, 0.03 * sd), whiteMat);
            button2.position.set(0, -th * 0.1, td / 2 + 0.01 * sd);
            torso.add(button1, button2);
        }

        // ==========================================
        // 2. HEAD (Modular features built as children)
        // ==========================================
        const head = new THREE.Mesh(new THREE.BoxGeometry(hw, hh, hd), skinMat);
        head.position.y = 2.45 * sh;
        head.castShadow = true;
        head.receiveShadow = true;
        group.add(head);

        // Core facial layout (Eyes, Pupils, Eyebrows, Nose)
        const eyeW = 0.15 * hw, eyeH = 0.15 * hh, eyeD = 0.02 * hd;
        const pupilW = 0.07 * hw, pupilH = 0.07 * hh, pupilD = 0.01 * hd;

        // Left Eye (White & Pupil)
        const eyeL = new THREE.Mesh(new THREE.BoxGeometry(eyeW, eyeH, eyeD), whiteMat);
        eyeL.position.set(-0.2 * hw, 0.05 * hh, hd / 2 + 0.005);
        const pupL = new THREE.Mesh(new THREE.BoxGeometry(pupilW, pupilH, pupilD), pupilMat);
        pupL.position.set(-0.2 * hw, 0.05 * hh, hd / 2 + 0.009);
        head.add(eyeL, pupL);

        // Right Eye (White & Pupil)
        const eyeR = new THREE.Mesh(new THREE.BoxGeometry(eyeW, eyeH, eyeD), whiteMat);
        eyeR.position.set(0.2 * hw, 0.05 * hh, hd / 2 + 0.005);
        const pupR = new THREE.Mesh(new THREE.BoxGeometry(pupilW, pupilH, pupilD), pupilMat);
        pupR.position.set(0.2 * hw, 0.05 * hh, hd / 2 + 0.009);
        head.add(eyeR, pupR);

        // Eyebrows
        const browL = new THREE.Mesh(new THREE.BoxGeometry(0.22 * hw, 0.05 * hh, 0.03 * hd), hairMat);
        browL.position.set(-0.21 * hw, 0.18 * hh, hd / 2 + 0.01);
        const browR = new THREE.Mesh(new THREE.BoxGeometry(0.22 * hw, 0.05 * hh, 0.03 * hd), hairMat);
        browR.position.set(0.21 * hw, 0.18 * hh, hd / 2 + 0.01);
        head.add(browL, browR);

        // Cute low-poly nose block (slightly darker/contrast skin color)
        const noseMat = new THREE.MeshStandardMaterial({ color: THREE.MathUtils.lerp(skinHex, 0x000000, 0.1), roughness: 0.9 });
        const nose = new THREE.Mesh(new THREE.BoxGeometry(0.12 * hw, 0.22 * hh, 0.1 * hd), noseMat);
        nose.position.set(0, -0.05 * hh, hd / 2 + 0.04 * hd);
        head.add(nose);

        // ==========================================
        // 3. HAIR & EXPRESSIVE LOW-POLY ACCENTS
        // ==========================================
        const hasBaldTop = (n.role === 'Merchant' || n.role === 'Doctor');

        // Hair Cap
        if (!hasBaldTop) {
            // General hair crown covering top
            const hairCap = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.06, hh * 0.18, hd * 1.06), hairMat);
            hairCap.position.set(0, hh / 2 + 0.06 * hh, -0.04 * hd);
            hairCap.castShadow = true;
            head.add(hairCap);
        }

        // Side/Back Hair (present for most, including receding hairstyles)
        const hairBack = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.06, hh * 0.85, hd * 0.15), hairMat);
        hairBack.position.set(0, -0.1 * hh, -hd / 2 - 0.04 * hd);
        head.add(hairBack);

        const hairSideL = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.1, hh * 0.8, hd * 1.02), hairMat);
        hairSideL.position.set(-hw / 2 - 0.03 * hw, -0.1 * hh, -0.02 * hd);
        const hairSideR = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.1, hh * 0.8, hd * 1.02), hairMat);
        hairSideR.position.set(hw / 2 + 0.03 * hw, -0.1 * hh, -0.02 * hd);
        head.add(hairSideL, hairSideR);

        // Role-Specific Hair Additions
        if (n.role === 'Blacksmith') {
            // Sturdy tied-back ponytail/bun (Representing Elara)
            const ponytail = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.25, hh * 0.4, hd * 0.25), hairMat);
            ponytail.position.set(0, -0.15 * hh, -hd / 2 - 0.15 * hd);
            ponytail.castShadow = true;
            head.add(ponytail);
        } else if (n.role === 'Teacher') {
            // Teacher hair bun (Lyra) with pink/magenta tie
            const hairTie = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.24, hh * 0.08, hd * 0.24), plumeMat);
            hairTie.position.set(0, hh / 2 + 0.15 * hh, -0.1 * hd);
            const bun = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.32, hh * 0.32, hd * 0.32), hairMat);
            bun.position.set(0, hh / 2 + 0.26 * hh, -0.1 * hd);
            bun.castShadow = true;
            head.add(hairTie, bun);
        } else if (n.role === 'Scientist') {
            // Spiky vertical hair for eccentric scholar (Elys)
            for (let j = -1; j <= 1; j++) {
                const spike = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.18, hh * 0.32, hd * 0.18), hairMat);
                spike.position.set(j * 0.35 * hw, hh / 2 + 0.18 * hh, (Math.random() - 0.5) * 0.2 * hd);
                spike.rotation.z = -j * 0.4;
                spike.rotation.y = (Math.random() - 0.5) * 0.4;
                head.add(spike);
            }
        }

        // ==========================================
        // 4. BEARDS & MOUSTACHES (Epic Handlebars & Cascading Goatees)
        // ==========================================
        if (n.role === 'Merchant') {
            // Epic curved Handlebar Moustache (Silas, exactly like the reference Merchant!)
            const brandMustacheCenter = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.35, hh * 0.12, hd * 0.1), darkMat);
            brandMustacheCenter.position.set(0, -0.28 * hh, hd / 2 + 0.02 * hd);
            
            const handleL = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.14, hh * 0.16, hd * 0.1), darkMat);
            handleL.position.set(-0.2 * hw, -0.22 * hh, hd / 2 + 0.03 * hd);
            handleL.rotation.z = Math.PI / 6;

            const handleR = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.14, hh * 0.16, hd * 0.1), darkMat);
            handleR.position.set(0.2 * hw, -0.22 * hh, hd / 2 + 0.03 * hd);
            handleR.rotation.z = -Math.PI / 6;

            head.add(brandMustacheCenter, handleL, handleR);
        } else if (n.role === 'Farmer' || n.role === 'Gravedigger' || n.role === 'Miner') {
            // Robust square low-poly work beard (Alaric/Kael/Doran)
            const workBeard = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.04, hh * 0.35, hd * 0.45), hairMat);
            workBeard.position.set(0, -hh / 2, hd * 0.1);
            workBeard.castShadow = true;
            head.add(workBeard);

            // Mouth gap indicator above it
            const faceCover = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.35, hh * 0.04, 0.01), darkMat);
            faceCover.position.set(0, -0.18 * hh, hd / 2 + 0.005);
            head.add(faceCover);
        } else if (n.role === 'Librarian' || n.role === 'Doctor' || n.role === 'Scribe' || n.role === 'Clockmaker') {
            // Wise cascading Elder Beard extending down towards chest
            const whiteBeardColor = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.9 });
            const wiseBeard = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.85, hh * 0.65, hd * 0.38), whiteBeardColor);
            wiseBeard.position.set(0, -hh / 2 - 0.15 * hh, hd * 0.12);
            wiseBeard.castShadow = true;
            head.add(wiseBeard);

            // Moustache
            const wiseMustache = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.5, hh * 0.12, hd * 0.1), whiteBeardColor);
            wiseMustache.position.set(0, -0.25 * hh, hd / 2 + 0.02 * hd);
            head.add(wiseMustache);
        }

        // ==========================================
        // 5. HELMETS, HATS, SPECTACLES, MONOCLES
        // ==========================================
        if (n.role === 'Farmer') {
            // Conical Straw Hat! (Yellowish gold straw)
            const strawHatGroup = new THREE.Group();
            strawHatGroup.position.set(0, hh / 2 + 0.01, 0);

            const rim = new THREE.Mesh(new THREE.BoxGeometry(hw * 2.1, hh * 0.08, hd * 2.1), goldMat);
            rim.castShadow = true;

            const crown = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.05, hh * 0.24, hd * 1.05), goldMat);
            crown.position.y = 0.12 * hh;
            crown.castShadow = true;

            const tip = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.5, hh * 0.18, hd * 0.5), goldMat);
            tip.position.y = 0.3 * hh;

            strawHatGroup.add(rim, crown, tip);
            strawHatGroup.rotation.x = 0.05; // stylish tilt
            head.add(strawHatGroup);
        } else if (n.role === 'Baker') {
            // High Puffy white Master Chef/Baker Hat!
            const bakerHatGroup = new THREE.Group();
            bakerHatGroup.position.set(0, hh / 2 + 0.02, 0);

            const hatBase = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.95, hh * 0.28, hd * 0.95), whiteMat);
            hatBase.castShadow = true;
            const hatPlump = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.25, hh * 0.45, hd * 1.25), whiteMat);
            hatPlump.position.y = 0.3 * hh;
            hatPlump.castShadow = true;

            bakerHatGroup.add(hatBase, hatPlump);
            head.add(bakerHatGroup);
        } else if (n.role === 'Gravedigger') {
            // Cemetery Inspector flat hat (rugged brim)
            const hatRim = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.8, hh * 0.06, hd * 1.8), darkMat);
            hatRim.position.set(0, hh / 2 + 0.03 * hh, 0);
            hatRim.castShadow = true;
            const hatCrown = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.02, hh * 0.22, hd * 1.02), darkMat);
            hatCrown.position.set(0, hh / 2 + 0.12 * hh, 0);
            hatCrown.castShadow = true;
            head.add(hatRim, hatCrown);
        } else if (n.role === 'Miner') {
            // Rugged hardhat with an orange glowing beacon/crystal light source box
            const minerCap = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.1, hh * 0.32, hd * 1.1), leatherMat);
            minerCap.position.set(0, hh / 2 + 0.1 * hh, 0);
            minerCap.castShadow = true;
            
            const lampMount = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.18, hh * 0.18, hd * 0.12), steelMat);
            lampMount.position.set(0, hh / 2 + 0.1 * hh, hd / 2 + 0.04 * hd);
            
            // Glowing mineral lamp crystal
            const goldGlowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xf59e0b, emissiveIntensity: 2.0 });
            const lampCrystal = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.12, hh * 0.12, hd * 0.06), goldGlowMat);
            lampCrystal.position.set(0, hh / 2 + 0.1 * hh, hd / 2 + 0.09 * hd);

            head.add(minerCap, lampMount, lampCrystal);
        } else if (n.role === 'Guard') {
            // Vanguard Iron Helmet with a Crimson Plume!
            const helmetGroup = new THREE.Group();
            helmetGroup.position.set(0, 0, 0);

            // Metal skull armor
            const cap = new THREE.Mesh(new THREE.BoxGeometry(hw * 1.12, hh * 1.05, hd * 1.12), steelMat);
            cap.position.y = 0.1 * hh;
            cap.castShadow = true;

            const noseGuard = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.1, hh * 0.45, hd * 0.05), steelMat);
            noseGuard.position.set(0, -0.15 * hh, hd / 2 + 0.06 * hd);

            // Majestic Red Crest/Plume
            const plume = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.14, hh * 0.35, hd * 1.2), plumeMat);
            plume.position.set(0, hh / 2 + 0.24 * hh, -0.05 * hd);
            plume.castShadow = true;

            helmetGroup.add(cap, noseGuard, plume);
            head.add(helmetGroup);
        } else if (n.role === 'Mayor') {
            // Golden high crown
            const crownGroup = new THREE.Group();
            crownGroup.position.set(0, hh / 2 + 0.1 * hh, 0);

            const crownRing = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.85, hh * 0.12, hd * 0.85), goldMat);
            crownGroup.add(crownRing);

            for (let c = 0; c < 4; c++) {
                const spike = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.12, hh * 0.22, hd * 0.12), goldMat);
                spike.position.set(
                    ((c === 0 || c === 1) ? 0.35 : -0.35) * hw,
                    0.1 * hh,
                    ((c === 0 || c === 2) ? 0.35 : -0.35) * hd
                );
                spike.rotation.y = Math.PI / 4;
                crownGroup.add(spike);
            }
            head.add(crownGroup);
        }

        // Eyeglasses (Specials for intellectuals)
        if (n.role === 'Teacher' || n.role === 'Librarian' || n.role === 'Doctor') {
            // Fine specs frame (built of simple low poly flat layers)
            const specsGroup = new THREE.Group();
            specsGroup.position.set(0, 0.05 * hh, hd / 2 + 0.012 * hd);

            const frameL = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.25, hh * 0.22, 0.02 * hd), goldMat);
            frameL.position.set(-0.2 * hw, 0, 0);
            const glassL = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.21, hh * 0.18, 0.01 * hd), glassMat);
            glassL.position.set(-0.2 * hw, 0, 0.005);

            const frameR = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.25, hh * 0.22, 0.02 * hd), goldMat);
            frameR.position.set(0.2 * hw, 0, 0);
            const glassR = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.21, hh * 0.18, 0.01 * hd), glassMat);
            glassR.position.set(0.2 * hw, 0, 0.005);

            const bridge = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.18, hh * 0.04, 0.01 * hd), goldMat);
            bridge.position.set(0, 0, 0);

            specsGroup.add(frameL, glassL, frameR, glassR, bridge);
            head.add(specsGroup);
        } else if (n.role === 'Clockmaker') {
            // Brass magnifying clockwork Monocle on Right Eye!
            const monocle = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.24, hh * 0.24, 0.06 * hd), goldMat);
            monocle.position.set(0.2 * hw, 0.05 * hh, hd / 2 + 0.015 * hd);
            const monocleGlass = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.18, hh * 0.18, 0.01 * hd), glassMat);
            monocleGlass.position.set(0.2 * hw, 0.05 * hh, hd / 2 + 0.042 * hd);

            const goldStrap = new THREE.Mesh(new THREE.BoxGeometry(hw * 0.55, hh * 0.03, hd * 1.05), goldMat);
            goldStrap.position.set(0.12 * hw, 0.05 * hh, 0);

            head.add(monocle, monocleGlass, goldStrap);
        }

        // ==========================================
        // 6. LOWER EXTREMITIES & ARMS
        // ==========================================
        // Legs (Pants/boots combo)
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.3 * sw, 1.0 * sh, 0.3 * sd), darkMat);
        legL.position.set(-0.2 * sw, 0.5 * sh, 0);
        legL.castShadow = true;
        legL.receiveShadow = true;
        group.add(legL);

        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.3 * sw, 1.0 * sh, 0.3 * sd), darkMat);
        legR.position.set(0.2 * sw, 0.5 * sh, 0);
        legR.castShadow = true;
        legR.receiveShadow = true;
        group.add(legR);

        // Brown boots/shoes overlay
        const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.33 * sw, 0.18 * sh, 0.42 * sd), leatherMat);
        bootL.position.set(-0.2 * sw, 0.09 * sh, 0.05 * sd);
        bootL.castShadow = true;
        group.add(bootL);

        const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.33 * sw, 0.18 * sh, 0.42 * sd), leatherMat);
        bootR.position.set(0.2 * sw, 0.09 * sh, 0.05 * sd);
        bootR.castShadow = true;
        group.add(bootR);

        // Arms (With hand cuffs!)
        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2 * sw, 1.0 * sh, 0.2 * sd), bodyMat);
        armL.position.set(-0.5 * sw, 1.6 * sh, 0);
        armL.castShadow = true;
        armL.receiveShadow = true;
        group.add(armL);

        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.2 * sw, 1.0 * sh, 0.2 * sd), bodyMat);
        armR.position.set(0.5 * sw, 1.6 * sh, 0);
        armR.castShadow = true;
        armR.receiveShadow = true;
        group.add(armR);

        // Flesh/Skin hands
        const handL = new THREE.Mesh(new THREE.BoxGeometry(0.24 * sw, 0.24 * sh, 0.24 * sd), skinMat);
        handL.position.set(-0.5 * sw, 1.0 * sh, 0);
        handL.castShadow = true;
        group.add(handL);

        const handR = new THREE.Mesh(new THREE.BoxGeometry(0.24 * sw, 0.24 * sh, 0.24 * sd), skinMat);
        handR.position.set(0.5 * sw, 1.0 * sh, 0);
        handR.castShadow = true;
        group.add(handR);

        // ==========================================
        // 7. WAYPOINT INITIALIZATION
        // ==========================================
        let posX = 0, posZ = 0;
        let waypoints = [];
        if(i < housePosList.length) {
            const h = housePosList[i];
            waypoints = [
                new THREE.Vector3(h.x + 8, 0, h.z + 8),
                new THREE.Vector3(h.x + 8, 0, h.z - 8),
                new THREE.Vector3(h.x - 8, 0, h.z - 8),
                new THREE.Vector3(h.x - 8, 0, h.z + 8)
            ];
        } else {
            const bx = (Math.random()-0.5) * mapSize * 0.5;
            const bz = (Math.random()-0.5) * mapSize * 0.5;
            waypoints = [
                new THREE.Vector3(bx + 8, 0, bz + 8),
                new THREE.Vector3(bx + 8, 0, bz - 8),
                new THREE.Vector3(bx - 8, 0, bz - 8),
                new THREE.Vector3(bx - 8, 0, bz + 8)
            ];
        }

        const startWp = Math.floor(Math.random() * waypoints.length);
        posX = waypoints[startWp].x;
        posZ = waypoints[startWp].z;

        const startY = getTerrainHeight(posX, posZ);
        group.position.set(posX, startY, posZ);
        group.userData = { 
            isNPC: true, id: n.id, 
            legL, legR, armL, armR, torso, head,
            baseY: startY,
            state: 'idle', stateTimer: Math.random() * 200 + 100,
            waypoints: waypoints,
            currentWaypoint: startWp,
            targetPos: new THREE.Vector3().copy(waypoints[startWp]),
            speed: 1.0 + Math.random() * 1.5,
            animOffset: Math.random() * Math.PI * 2
        };
        
        scene.add(group);
        npcMeshes.push(group);
        
        const box = new THREE.Box3().setFromObject(group);
        box.expandByScalar(0.2);
        collidables.push(box);
    });
}

// ==========================================
// INTERACTION & UI FLOW
// ==========================================
let selectedNPCId = null;
let selectedClutter = null;
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

function checkInteractions() {
    if (!controls.isLocked) return;
    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects([...npcMeshes, ...clutterMeshes], true);
    selectedNPCId = null;
    selectedClutter = null;
    ui.interactPrompt.classList.add('hidden');

    if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.distance < 4.5) {
            let obj = hit.object;
            while(obj.parent && !obj.userData.isNPC && !obj.userData.isClutter) obj = obj.parent;
            if (obj.userData && obj.userData.isNPC) {
                selectedNPCId = obj.userData.id;
                ui.interactPrompt.classList.remove('hidden');
                ui.interactPrompt.textContent = 'PRESS [E] TO INTERROGATE';
                ui.npcName.textContent = getNPCContext(selectedNPCId).name; // preload

                if (!tooltipState.interactHint) {
                    tooltipState.interactHint = true;
                    showTooltip("Interrogation", "Press [E] to interrogate suspects. Find lies and expose the criminal.", 6000);
                }
            } else if (obj.userData && obj.userData.isClutter) {
                selectedClutter = obj.userData;
                ui.interactPrompt.classList.remove('hidden');
                ui.interactPrompt.textContent = 'PRESS [E] TO INSPECT';
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' && controls.isLocked) {
        if (selectedNPCId) {
            audio.playInteractionBeep();
            openDialogue(selectedNPCId);
        } else if (selectedClutter) {
            audio.playInteractionBeep();
            showTooltip("Inspection", selectedClutter.flavorText, 6000);
            if (selectedClutter.isHeavy) {
                triggerCameraShake(0.3);
            }
        }
    }
    if ((e.code === 'Escape' || e.code === 'Tab') && gameState.gameActive && controls.isLocked) {
        // controls.unlock() will trigger the general openNotebook due to our event listener
        // But explicitly calling it is safer. Wait, unlock triggers event, so let it handle it.
        // Wait, Tab doesn't trigger pointerlock unlock automatically.
        if(e.code === 'Tab') {
            e.preventDefault();
            controls.unlock();
            openNotebook();
        }
    }
});

controls.addEventListener('lock', () => {
    if (!gameState.gameActive) return;
    hideAllScreens();
    ui.hud.classList.remove('hidden');
    // Ensure all NPCs return to active wandering
    npcMeshes.forEach(m => { if(m.userData.state === 'talking') m.userData.state = 'idle'; });
});

controls.addEventListener('unlock', () => {
    if (gameState.gameActive && ui.dialogueScreen.classList.contains('hidden') && ui.accusationScreen.classList.contains('hidden')) {
        openNotebook();
    }
});

ui.resumeBtn.addEventListener('click', closeScreensAndResume);
ui.leaveBtn.addEventListener('click', closeScreensAndResume);
ui.kbBtn.addEventListener('click', () => {
    audio.playPaperFlip();
    ui.notebookScreen.classList.add('hidden');
    ui.kbScreen.classList.remove('hidden');
    const modal = ui.kbScreen.querySelector('.modal');
    if (modal) {
        modal.classList.remove('page-turn');
        void modal.offsetWidth;
        modal.classList.add('page-turn');
    }
});
ui.closeKbBtn.addEventListener('click', () => {
    audio.playPaperFlip();
    ui.kbScreen.classList.add('hidden');
    ui.notebookScreen.classList.remove('hidden');
    const modal = ui.notebookScreen.querySelector('.modal');
    if (modal) {
        modal.classList.remove('page-turn');
        void modal.offsetWidth;
        modal.classList.add('page-turn');
    }
});
ui.cancelAccuseBtn.addEventListener('click', () => {
    ui.accusationScreen.classList.add('hidden');
    openNotebook();
});
ui.accuseBtn.addEventListener('click', () => {
    ui.notebookScreen.classList.add('hidden');
    openAccusationScreen();
});
ui.restartBtn.addEventListener('click', () => window.location.reload());

function closeScreensAndResume() {
    if (!ui.notebookScreen.classList.contains('hidden') || !ui.kbScreen.classList.contains('hidden')) {
        audio.playPaperFlip();
    }
    hideAllScreens();
    ui.hud.classList.remove('hidden');
    if (gameState.gameActive) {
        controls.lock();
    }
}

function updatePortrait(expression, color) {
    const bg = document.getElementById('npc-portrait-bg');
    if (bg && color !== undefined) bg.setAttribute('fill', '#' + color.toString(16).padStart(6, '0'));

    const exprs = ['expr-neutral', 'expr-suspicious', 'expr-surprised', 'expr-happy'];
    exprs.forEach(expr => {
        const el = document.getElementById(expr);
        // We use SVG, so we might need block display or just toggle a class 'hidden'
        // let's ensure the class is set
        if (el) el.classList.add('hidden');
    });

    const targetEl = document.getElementById('expr-' + expression);
    if (targetEl) targetEl.classList.remove('hidden');
}

function openDialogue(npcId) {
    controls.unlock(); 
    gameState.currentNpcId = npcId;
    const npc = getNPCContext(npcId);
    const p = gameState.npcProgress[npcId];

    // Force NPC to face player
    const npcMesh = npcMeshes.find(m => m.userData.id === npcId);
    if(npcMesh) {
        npcMesh.userData.state = 'talking';
    }

    hideAllScreens();
    ui.dialogueScreen.classList.remove('hidden');
    
    ui.npcName.textContent = npc.name;
    ui.npcName.style.color = '#' + npc.color.toString(16).padStart(6, '0');
    ui.npcRole.textContent = npc.role;
    typeWriterEffect(ui.npcDialogue, `"${npc.dialogue}"`);

    // default expression based on state
    if (p.questionPassed) {
        updatePortrait('happy', npc.color);
    } else {
        updatePortrait('neutral', npc.color);
    }

    ui.qContainer.classList.add('hidden');
    ui.fContainer.classList.add('hidden');
    ui.hContainer.classList.add('hidden');
    ui.qOptions.innerHTML = '';

    if (p.questionPassed) {
        ui.hContainer.classList.remove('hidden');
        ui.hText.textContent = `"${gameState.npcHints[npcId]}"`;
    } else {
        ui.qContainer.classList.remove('hidden');
        ui.qTopic.textContent = "KNOWLEDGE CHECK: " + npc.topic;
        ui.qText.textContent = npc.question.text;
        
        npc.question.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = `${['A','B','C','D'][idx]}. ${opt}`;
            btn.onclick = () => { audio.playInteractionBeep(); submitAnswer(idx, btn); };
            ui.qOptions.appendChild(btn);
        });

        ui.buyHintBtn.disabled = gameState.evidencePoints < 20;
        ui.buyHintBtn.onclick = () => {
            audio.playInteractionBeep();
            if (gameState.evidencePoints >= 20) {
                gameState.evidencePoints -= 20;
                p.questionPassed = true;
                updateEvidenceDisplay();
                openDialogue(npcId);
            }
        };
    }
}

function typeWriterEffect(element, text) {
    element.textContent = "";
    let i = 0;
    function type() {
        if (!ui.dialogueScreen.classList.contains('hidden') && i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 15);
        }
    }
    type();
}

function submitAnswer(idx, btnElement) {
    const npc = getNPCContext(gameState.currentNpcId);
    const p = gameState.npcProgress[gameState.currentNpcId];
    
    Array.from(ui.qOptions.children).forEach(b => b.disabled = true);
    ui.buyHintBtn.disabled = true;
    
    ui.fContainer.classList.remove('hidden');
    ui.fText.classList.remove('feedback-correct', 'feedback-wrong');

    if (idx === npc.question.correct) {
        audio.playSuccessBeep();
        updatePortrait('surprised');
        spawnClueParticles(gameState.currentNpcId);
        btnElement.classList.add('correct');
        const basePts = Math.max(0, 10 - p.failedAttempts * 5);
        const timeBonus = Math.round((1.0 - environmentProgress) * 5);
        const pts = basePts + timeBonus;
        ui.fText.textContent = `VERIFIED. Evidence Acquired (+${pts} = ${basePts} Base + ${timeBonus} Time Bonus)`;
        ui.fText.classList.add('feedback-correct');
        
        gameState.evidencePoints += pts;
        p.questionPassed = true;
        updateEvidenceDisplay(true);
        
        ui.fExp.textContent = npc.question.explanation;
        ui.nextBtn.classList.remove('hidden');
        ui.nextBtn.textContent = 'Access Testimony';
        ui.nextBtn.onclick = () => { ui.nextBtn.classList.add('hidden'); openDialogue(gameState.currentNpcId); };
    } else {
        audio.playErrorBeep();
        updatePortrait('suspicious');
        btnElement.classList.add('wrong');
        p.failedAttempts++;
        ui.fText.textContent = `INCORRECT DEDUCTION. Penalized.`;
        ui.fText.classList.add('feedback-wrong');
        ui.fExp.textContent = '';
        
        ui.nextBtn.classList.remove('hidden');
        ui.nextBtn.textContent = 'Re-evaluate';
        ui.nextBtn.onclick = () => { ui.nextBtn.classList.add('hidden'); openDialogue(gameState.currentNpcId); };
    }
}

function openNotebook() {
    if (ui.notebookScreen.classList.contains('hidden') && ui.kbScreen.classList.contains('hidden')) {
        audio.playPaperFlip();
        const modal = ui.notebookScreen.querySelector('.modal');
        if (modal) {
            modal.classList.remove('page-turn');
            void modal.offsetWidth;
            modal.classList.add('page-turn');
        }
    }
    hideAllScreens();
    ui.hud.classList.remove('hidden'); 
    ui.notebookScreen.classList.remove('hidden');
    ui.notebookPts.textContent = gameState.score;
    
    if(!tooltipState.notebookHint) {
        tooltipState.notebookHint = true;
        showTooltip("Investigation Ledger", "Review suspect testimonies and use your knowledge points to scan for lies.");
    }
    
    ui.notebookGrid.innerHTML = '';

    gameState.activeNPCs.forEach(npc => {
        const p = gameState.npcProgress[npc.id];
        const card = document.createElement('div');
        card.className = `npc-card ${p.scanned ? 'scanned-' + gameState.npcTruthStatuses[npc.id] : ''}`;
        
        const nameNode = document.createElement('div');
        nameNode.className = 'npc-name glow-text';
        nameNode.textContent = npc.name;
        nameNode.style.color = '#' + npc.color.toString(16).padStart(6, '0');
        
        const roleNode = document.createElement('div');
        roleNode.className = 'npc-role';
        roleNode.textContent = npc.role;
        
        const hintBox = document.createElement('div');
        hintBox.className = 'npc-hint-box';
        const hintNode = document.createElement('p');
        if (p.questionPassed) {
            hintNode.className = 'npc-hint';
            hintNode.textContent = `"${gameState.npcHints[npc.id]}"`;
        } else {
            hintNode.className = 'npc-hint locked';
            hintNode.textContent = 'RESTRICTED FILE';
        }
        hintBox.appendChild(hintNode);
        
        card.appendChild(nameNode);
        card.appendChild(roleNode);
        card.appendChild(hintBox);

        if (p.scanned) {
            const status = document.createElement('div');
            status.className = 'npc-status ' + gameState.npcTruthStatuses[npc.id].toLowerCase() + '-tag';
            status.textContent = gameState.npcTruthStatuses[npc.id];
            card.appendChild(status);
        } else {
            const scanBtn = document.createElement('button');
            scanBtn.className = 'scan-btn';
            scanBtn.textContent = `Run Lie Scan (15 PTS)`;
            scanBtn.disabled = gameState.evidencePoints < SCAN_COST;
            scanBtn.onclick = () => {
                audio.playInteractionBeep();
                gameState.evidencePoints -= SCAN_COST;
                p.scanned = true;
                updateEvidenceDisplay();
                openNotebook();
            };
            card.appendChild(scanBtn);
        }
        ui.notebookGrid.appendChild(card);
    });
}

function openAccusationScreen() {
    hideAllScreens();
    ui.accusationScreen.classList.remove('hidden');
    ui.suspectsGrid.innerHTML = '';

    gameState.activeNPCs.forEach(n => {
        const card = document.createElement('div');
        card.className = 'npc-card';
        card.style.alignItems = 'center';

        const nameNode = document.createElement('h3');
        nameNode.className = 'npc-name';
        nameNode.textContent = n.name;
        nameNode.style.color = '#' + n.color.toString(16).padStart(6, '0');

        const roleNode = document.createElement('span');
        roleNode.className = 'npc-role';
        roleNode.textContent = n.role;

        const btn = document.createElement('button');
        btn.className = 'accuse-suspect-btn';
        btn.textContent = 'Accuse';
        btn.onclick = () => { audio.playInteractionBeep(); finishGame(n.id); };

        card.appendChild(nameNode); card.appendChild(roleNode); card.appendChild(btn);
        ui.suspectsGrid.appendChild(card);
    });
}

function finishGame(accusedId) {
    hideAllScreens();
    ui.endScreen.classList.remove('hidden');
    const actualCrim = getNPCContext(gameState.criminalId);
    
    // Add strong camera shake for impactful accusation
    triggerCameraShake(1.2);
    
    if (accusedId === gameState.criminalId) {
        ui.endTitle.textContent = "CASE RESOLVED";
        ui.endTitle.style.color = '#4ade80';
        ui.endDesc.innerHTML = `Your logic is flawless.<br/><br/>You correctly identified <strong style="color:white">${actualCrim.name} the ${actualCrim.role}</strong> as the saboteur.<br/>The master codebase is restored.`;
    } else {
        audio.playErrorBeep();
        ui.endTitle.textContent = "FATAL ERROR";
        ui.endTitle.style.color = '#f87171';
        ui.endDesc.innerHTML = `You made a grave miscalculation.<br/><br/>You accused the wrong entity. The true saboteur was <strong style="color:white">${actualCrim.name} the ${actualCrim.role}</strong>.<br/>The village collapses into the shadows.`;
    }
}

// ==========================================
// FOOTPRINT SYSTEM
// ==========================================
const footprints = [];
const footprintGeo = new THREE.PlaneGeometry(0.2, 0.4);

function spawnFootprint(position, moveDir, isLeft) {
    if (moveDir.length() < 0.01) return;
    moveDir.normalize();

    const mat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false });
    const mesh = new THREE.Mesh(footprintGeo, mat);
    
    mesh.position.copy(position);
    mesh.position.y = getTerrainHeight(mesh.position.x, mesh.position.z) + 0.02 + Math.random() * 0.01; 

    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = -Math.atan2(moveDir.z, moveDir.x) - Math.PI/2;
    
    const offsetMag = 0.25;
    const rightVec = new THREE.Vector3(moveDir.z, 0, -moveDir.x).normalize();
    if (isLeft) rightVec.negate();
    
    mesh.position.addScaledVector(rightVec, offsetMag);

    scene.add(mesh);
    footprints.push({ mesh, life: 1.0 });

    if (footprints.length > 300) {
        const oldFp = footprints.shift();
        scene.remove(oldFp.mesh);
        oldFp.mesh.material.dispose();
    }
}

function updateFootprints(delta) {
    for (let i = footprints.length - 1; i >= 0; i--) {
        const fp = footprints[i];
        fp.life -= delta * 0.15; // fade over ~6.6 seconds
        if (fp.life <= 0) {
            scene.remove(fp.mesh);
            fp.mesh.material.dispose();
            footprints.splice(i, 1);
        } else {
            fp.mesh.material.opacity = fp.life * 0.25;
        }
    }
}

// ==========================================
// LOOP & PHYSICS
// ==========================================
const moveState = { forward: false, backward: false, left: false, right: false };
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let prevTime = performance.now();
let lastPlayerFootprintPos = new THREE.Vector3();
let playerFootprintLeft = false;

// ==========================================
// TOOLTIPS & EMOTES STATE
// ==========================================
let tooltipState = {
    outskirts: false,
    villageSquare: false,
    interactHint: false,
    notebookHint: false
};
let emoteTimer = null;
let tooltipTimer = null;

function showTooltip(title, text, duration = 4000) {
    ui.tooltipTitle.textContent = title;
    ui.tooltipText.textContent = text;
    ui.gameTooltip.classList.remove('hidden');
    requestAnimationFrame(() => ui.gameTooltip.classList.add('show'));
    
    if(tooltipTimer) clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => {
        ui.gameTooltip.classList.remove('show');
        setTimeout(() => ui.gameTooltip.classList.add('hidden'), 400);
    }, duration);
}

function showEmote(icon, text, emoteId = 1) {
    if(!gameState.gameActive) return;
    ui.emoteIcon.textContent = icon;
    ui.emoteText.textContent = text;
    ui.playerEmote.classList.remove('hidden');
    requestAnimationFrame(() => ui.playerEmote.classList.add('show'));
    
    currentEmote = emoteId;
    emoteAnimationTimer = 0;
    
    if(emoteTimer) clearTimeout(emoteTimer);
    emoteTimer = setTimeout(() => {
        ui.playerEmote.classList.remove('show');
        setTimeout(() => ui.playerEmote.classList.add('hidden'), 300);
        currentEmote = null;
    }, 2500);
}

function checkContextTooltips() {
    if (!gameState.gameActive) return;
    const px = camera.position.x;
    const pz = camera.position.z;
    const distFromCenter = Math.sqrt(px*px + pz*pz);

    if (distFromCenter < 12 && !tooltipState.villageSquare) {
        tooltipState.villageSquare = true;
        showTooltip("Village Center", "The heart of Shadow Village. Suspects frequently gather here.");
    }

    if (distFromCenter > (gameState.mapSize * 0.8) && !tooltipState.outskirts) {
        tooltipState.outskirts = true;
        showTooltip("The Outskirts", "Beyond this point lies uncertainty. Returning to the village is advised.");
    }
}

document.addEventListener('keydown', (e) => {
    if (!gameState.gameActive) return;
    switch(e.code) { 
        case 'KeyW': moveState.forward=true; break; 
        case 'KeyA': moveState.left=true; break; 
        case 'KeyS': moveState.backward=true; break; 
        case 'KeyD': moveState.right=true; break; 
        case 'Digit1': showEmote('👋', '* Waving *', 1); break;
        case 'Digit2': showEmote('👉', '* Pointing *', 2); break;
        case 'Digit3': showEmote('🤔', '* Thinking *', 3); break;
        case 'Digit4': showEmote('✅', '* Nodding *', 4); break;
    }
});
document.addEventListener('keyup', (e) => {
    if (!gameState.gameActive) return;
    switch(e.code) { case 'KeyW': moveState.forward=false; break; case 'KeyA': moveState.left=false; break; case 'KeyS': moveState.backward=false; break; case 'KeyD': moveState.right=false; break; }
});

function checkWallCollisions(newPosition) {
    const r = 0.4;
    const feetY = getTerrainHeight(newPosition.x, newPosition.z);
    const playerBox = new THREE.Box3(
        new THREE.Vector3(newPosition.x - r, feetY, newPosition.z - r), 
        new THREE.Vector3(newPosition.x + r, feetY + 2.5, newPosition.z + r)
    );
    for (let box of collidables) if (playerBox.intersectsBox(box)) return true;
    const limit = gameState.mapSize;
    if (newPosition.x > limit || newPosition.x < -limit || newPosition.z > limit || newPosition.z < -limit) return true;
    return false;
}

function updateMinimap() {
    if (!ui.minimap) return;
    const ctx = ui.minimap.getContext('2d');
    const width = ui.minimap.width;
    const height = ui.minimap.height;
    ctx.clearRect(0, 0, width, height);

    const playerPos = camera.position;
    const mapScale = gameState.mapScale;
    const cx = width / 2; const cy = height / 2;

    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, width / 2, 0, Math.PI * 2); ctx.clip();
    ctx.translate(cx, cy);

    // Cross Paths
    ctx.fillStyle = 'rgba(100, 116, 139, 0.4)';
    const lim = gameState.mapSize;
    ctx.fillRect((-lim - playerPos.x) * mapScale, (-4 - playerPos.z) * mapScale, lim*2 * mapScale, 8 * mapScale);
    ctx.fillRect((-4 - playerPos.x) * mapScale, (-lim - playerPos.z) * mapScale, 8 * mapScale, lim*2 * mapScale);

    // NPCs
    gameState.activeNPCs.forEach(n => {
        const mesh = npcMeshes.find(m => m.userData.id === n.id);
        if(!mesh) return;
        const mx = (mesh.position.x - playerPos.x) * mapScale;
        const my = (mesh.position.z - playerPos.z) * mapScale;
        ctx.fillStyle = '#' + n.color.toString(16).padStart(6, '0');
        ctx.beginPath(); ctx.arc(mx, my, 2 * mapScale, 0, Math.PI * 2); ctx.fill();
    });

    // Player
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(0, 0, 2 * mapScale, 0, Math.PI * 2); ctx.fill();

    const dir = new THREE.Vector3(); camera.getWorldDirection(dir);
    const angle = Math.atan2(dir.z, dir.x);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 20 * mapScale, angle - 0.6, angle + 0.6); ctx.fill();

    ctx.restore();
}

function animate() {
    requestAnimationFrame(animate);
    const time = performance.now();
    const delta = (time - prevTime) / 1000;

    // Discard previous frame's synthetic shake offset
    camera.position.sub(currentShakeOffset);

    if (gameState.gameActive) {
        checkContextTooltips();
        
        gameState.timePassed = (gameState.timePassed || 0) + delta;
        // 300 second day-to-dusk-to-day cycle
        const cycleProgress = 0.5 - 0.5 * Math.cos((gameState.timePassed / 300) * 2 * Math.PI);
        
        environmentProgress = cycleProgress;

        scene.background.lerpColors(colorSkyAfternoon, colorSkyDusk, environmentProgress);
        scene.fog.color.lerpColors(colorSkyAfternoon, colorSkyDusk, environmentProgress);

        dirLightColor.lerpColors(colorSunAfternoon, colorSunDusk, environmentProgress);
        const currentLightPos = new THREE.Vector3().lerpVectors(sunPosAfternoon, sunPosDusk, environmentProgress);
        csm.lightDirection.copy(currentLightPos).negate().normalize();
        
        csm.lights.forEach(light => {
            light.color.copy(dirLightColor);
            light.intensity = THREE.MathUtils.lerp(dirLightIntensity, 0.8, environmentProgress);
        });

        ambientLight.color.lerpColors(colorAmbAfternoon, colorAmbDusk, environmentProgress);
        ambientLight.intensity = THREE.MathUtils.lerp(0.6, 0.2, environmentProgress);

        audio.setAmbianceProgress(environmentProgress);
    }

    // NPC AI & Animation
    npcMeshes.forEach(mesh => {
        const u = mesh.userData;
        const dt = delta;

        const distToPlayer = Math.sqrt((camera.position.x - mesh.position.x)**2 + (camera.position.z - mesh.position.z)**2);
        let targetRotationY = mesh.rotation.y;
        
        if (u.state !== 'talking' && distToPlayer < 4.5 && controls.isLocked) {
            // Player is close, switch to idle if walking
            if (u.state === 'walking') {
                u.state = 'idle';
                u.stateTimer = 100; // brief pause
            }
            const dirX = camera.position.x - mesh.position.x;
            const dirZ = camera.position.z - mesh.position.z;
            targetRotationY = Math.atan2(dirX, dirZ);
        }

        if (u.state === 'talking') {
            u.legL.rotation.x = 0; u.legR.rotation.x = 0;
            u.armL.rotation.x = Math.sin(time*0.002 + u.animOffset)*0.1;
            u.armR.rotation.x = -Math.sin(time*0.002 + u.animOffset)*0.1;
            
            const dirX = camera.position.x - mesh.position.x;
            const dirZ = camera.position.z - mesh.position.z;
            targetRotationY = Math.atan2(dirX, dirZ);
        } else {
            u.stateTimer--;

            if (u.state === 'idle') {
                u.legL.rotation.x = 0; u.legR.rotation.x = 0;
                u.armL.rotation.x = 0; u.armR.rotation.x = 0;
                mesh.position.y = u.baseY + Math.sin(time * 0.0015 + u.animOffset) * 0.05; // breathe
                
                if (u.stateTimer <= 0) {
                    u.state = 'walking';
                    u.stateTimer = Math.random() * 400 + 200; // max walk timeout limit
                    u.currentWaypoint = (u.currentWaypoint + 1) % u.waypoints.length;
                    u.targetPos.copy(u.waypoints[u.currentWaypoint]);
                }
            } else if (u.state === 'walking') {
                const dist = mesh.position.distanceTo(u.targetPos);
                if (dist < 1 || u.stateTimer <= 0) {
                    u.state = 'idle'; u.stateTimer = Math.random() * 200 + 100;
                } else {
                    mesh.position.y = u.baseY + Math.abs(Math.sin(time * 0.005)) * 0.1; // Walk bounce
                    u.legL.rotation.x = Math.sin(time * 0.005) * 0.5;
                    u.legR.rotation.x = -Math.sin(time * 0.005) * 0.5;
                    u.armL.rotation.x = -Math.sin(time * 0.005) * 0.4;
                    u.armR.rotation.x = Math.sin(time * 0.005) * 0.4;

                    const dirX = u.targetPos.x - mesh.position.x;
                    const dirZ = u.targetPos.z - mesh.position.z;
                    targetRotationY = Math.atan2(dirX, dirZ);

                    const moveDir = new THREE.Vector3(dirX, 0, dirZ).normalize();
                    const nextPos = mesh.position.clone().add(moveDir.multiplyScalar(u.speed * dt));
                    
                    if (!u.lastFootprintPos) {
                        u.lastFootprintPos = mesh.position.clone();
                        u.footprintLeft = false;
                    }
                    const npcMoveVec = new THREE.Vector3().subVectors(mesh.position, u.lastFootprintPos);
                    if (npcMoveVec.length() > 0.8) {
                        spawnFootprint(mesh.position, npcMoveVec, u.footprintLeft);
                        u.footprintLeft = !u.footprintLeft;
                        u.lastFootprintPos.copy(mesh.position);
                    }

                    // Simple bounds check for NPC
                    if (Math.abs(nextPos.x) < gameState.mapSize && Math.abs(nextPos.z) < gameState.mapSize) {
                        mesh.position.x = nextPos.x;
                        mesh.position.z = nextPos.z;
                        u.baseY = getTerrainHeight(mesh.position.x, mesh.position.z);
                    } else {
                        u.state = 'idle';
                    }
                }
            }
        }

        // Smooth rotation
        if (targetRotationY !== mesh.rotation.y) {
            let diff = targetRotationY - mesh.rotation.y;
            diff = Math.atan2(Math.sin(diff), Math.cos(diff));
            mesh.rotation.y += diff * dt * 5.0; // adjust smoothing speed as desired
        }
    });

    if (controls.isLocked) {
        const currentGroundPos = camera.position.clone();
        currentGroundPos.y = 0;
        const moveVec = new THREE.Vector3().subVectors(currentGroundPos, lastPlayerFootprintPos);
        if (moveVec.length() > 0.8 && velocity.length() > 0.1) {
            spawnFootprint(currentGroundPos, moveVec, playerFootprintLeft);
            playerFootprintLeft = !playerFootprintLeft;
            lastPlayerFootprintPos.copy(currentGroundPos);
        }

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(moveState.forward) - Number(moveState.backward);
        direction.x = Number(moveState.right) - Number(moveState.left);
        direction.normalize(); 

        const speed = 40.0;
        let isMoving = false;
        if (moveState.forward || moveState.backward) { velocity.z -= direction.z * speed * delta; isMoving = true; }
        if (moveState.left || moveState.right) { velocity.x -= direction.x * speed * delta; isMoving = true; }

        if (isMoving) {
            const px = camera.position.x;
            const pz = camera.position.z;
            // The path has width 8, so abs(axis) < 4 is strictly inside. Let's use 4.
            const isOnPath = Math.abs(px) <= 4 || Math.abs(pz) <= 4;
            audio.playFootstep(isOnPath);
        }

        const currentPos = camera.position.clone();
        
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        if (checkWallCollisions(camera.position)) {
            const tempPos = camera.position.clone();
            
            // Try sliding on Z only
            camera.position.set(currentPos.x, tempPos.y, tempPos.z);
            if (checkWallCollisions(camera.position)) {
                // Try sliding on X only
                camera.position.set(tempPos.x, tempPos.y, currentPos.z);
                if (checkWallCollisions(camera.position)) {
                    // Full revert if both directions blocked
                    camera.position.copy(currentPos);
                }
            }
        }
        
        // Prevent getting completely stuck inside geometry due to spawning or terrain anomalies.
        // If we are still stuck at currentPos, attempt to push them slightly towards the center.
        if (checkWallCollisions(camera.position)) {
            const dir = new THREE.Vector3().subVectors(new THREE.Vector3(0,0,0), camera.position).normalize();
            camera.position.addScaledVector(dir, 0.5);
        }

        camera.position.y = getTerrainHeight(camera.position.x, camera.position.z) + 1.8; // Camera height

        checkInteractions();
        updateMinimap();
    }
    
    updateFootprints(delta);
    updateBirds(delta, time / 1000);
    updateClutter(time / 1000);
    updatePathIndicators(time / 1000);
    updateWeather(delta, environmentProgress);
    updatePlayerArms(delta);

    for (let i = activeParticles.length - 1; i >= 0; i--) {
        const p = activeParticles[i];
        p.life -= delta * 0.7; // Approx 1.4 seconds life
        if (p.life <= 0) {
            scene.remove(p.mesh);
            p.mesh.geometry.dispose();
            p.mesh.material.dispose();
            activeParticles.splice(i, 1);
            continue;
        }
        const positions = p.mesh.geometry.attributes.position.array;
        for (let j = 0; j < p.velocities.length; j++) {
            positions[j * 3] += p.velocities[j].x * delta;
            positions[j * 3 + 1] += p.velocities[j].y * delta;
            positions[j * 3 + 2] += p.velocities[j].z * delta;
            p.velocities[j].y -= 4.0 * delta; // gentle gravity
        }
        p.mesh.geometry.attributes.position.needsUpdate = true;
        p.mesh.material.opacity = p.life;
    }

    // Apply new synthetic shake offset
    if (screenShakeMagnitude > 0) {
        screenShakeMagnitude = Math.max(0, screenShakeMagnitude - delta * 2.0);
        currentShakeOffset.set(
            (Math.random() - 0.5) * screenShakeMagnitude,
            (Math.random() - 0.5) * screenShakeMagnitude,
            (Math.random() - 0.5) * screenShakeMagnitude
        );
    } else {
        currentShakeOffset.set(0, 0, 0);
    }
    camera.position.add(currentShakeOffset);

    prevTime = time;
    csm.update();
    renderer.render(scene, camera);
}
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    csm.updateFrustums();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
animate();
