import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { createNoise2D } from 'simplex-noise';
import { CSM } from 'three/examples/jsm/csm/CSM.js';

// ==========================================
// DATA & LOGIC
// ==========================================
const noise2D = createNoise2D();
const ALL_NPCS_DATA = [
    { id: 'n1', name: 'Alaric', role: 'Farmer', gender: 'Male', color: 0x8b5a2b, size: [1, 1.05, 1], topic: 'Variables',
      dialogue: 'The soil is rich tonight, but something darker is taking root. I was counting my seeds earlier...',
      question: { text: 'To store the exact number of seeds (e.g. 50), which C++ variable type is most appropriate and memory efficient?', options: ['double', 'int', 'bool', 'char'], correct: 1, explanation: 'An integer (int) is used for whole numbers.' } },
    { id: 'n2', name: 'Elara', role: 'Blacksmith', gender: 'Female', color: 0x4a4a4a, size: [1.1, 0.95, 1.1], topic: 'Data Types',
      dialogue: 'I hammer iron, not lies. But someone has been tampering with my forge temperatures.',
      question: { text: 'If I need to store a very precise temperature like 1204.567f, which type is best?', options: ['int', 'float', 'long', 'char'], correct: 1, explanation: 'Float is used for single-precision floating-point numbers.' } },
    { id: 'n3', name: 'Silas', role: 'Merchant', gender: 'Male', color: 0x800080, size: [0.95, 1, 0.95], topic: 'Operators',
      dialogue: 'Coin doesn\'t lie, but people do. A transaction was altered in the ledger!',
      question: { text: 'What is the result of 15 % 4 in my ledger?', options: ['3', '4', '3.75', '15'], correct: 0, explanation: 'The modulo operator % returns the remainder of division. 15 / 4 is 3 with remainder 3.' } },
    { id: 'n4', name: 'Vael', role: 'Guard', gender: 'Female', color: 0xb22222, size: [1.05, 1.1, 1], topic: 'Conditions',
      dialogue: 'None shall pass... unless they possess the right credentials. An authorized entry was recorded at the murder time.',
      question: { text: 'Which operator evaluates to true ONLY if BOTH conditions are true?', options: ['||', '!=', '==', '&&'], correct: 3, explanation: 'The logical AND operator (&&) requires both conditions to be true.' } },
    { id: 'n5', name: 'Thorne', role: 'Doctor', gender: 'Male', color: 0x008080, size: [0.95, 1.05, 0.95], topic: 'Loops',
      dialogue: 'I administer doses until the plague subsides. Someone changed my recurrence formula.',
      question: { text: 'If I use a `while(true)` loop for administering doses without a `break`, what happens?', options: ['Syntax Error', 'Infinite Loop', 'Loop runs once', 'Loop exits immediately'], correct: 1, explanation: 'A while(true) loop will run forever unless explicitly broken.' } },
    { id: 'n6', name: 'Lyra', role: 'Teacher', gender: 'Female', color: 0x4682b4, size: [0.9, 0.95, 0.9], topic: 'Functions',
      dialogue: 'Knowledge is power. The killer used an unmarked function to hide their tracks!',
      question: { text: 'What keyword defines a function that returns NO value?', options: ['null', 'void', 'empty', 'return'], correct: 1, explanation: 'The `void` keyword specifies that a function does not return a value.' } },
    { id: 'n7', name: 'Gael', role: 'Baker', gender: 'Male', color: 0xd2b48c, size: [1.1, 1, 1.1], topic: 'Arrays',
      dialogue: 'I line up my loaves in a neat array. One loaf is missing from the batch!',
      question: { text: 'If an array `int loaves[5]` is created, what is the index of the LAST element?', options: ['5', '4', '1', '0'], correct: 1, explanation: 'Arrays in C++ are 0-indexed. A size 5 array has indices 0 through 4.' } },
    { id: 'n8', name: 'Rowena', role: 'Librarian', gender: 'Female', color: 0x228b22, size: [1, 1, 1], topic: 'Strings',
      dialogue: 'A torn parchment. A sequence of characters... Null terminated, like the victim.',
      question: { text: 'In C++, how do you find the length of a `std::string str`?', options: ['length(str)', 'str.size()', 'str.length', 'sizeOf(str)'], correct: 1, explanation: '`str.size()` or `str.length()` (as a method) returns the length of a string object.' } },
    { id: 'n9', name: 'Kael', role: 'Miner', gender: 'Male', color: 0x708090, size: [1.05, 0.95, 1.05], topic: 'Pointers',
      dialogue: 'I dig deep. To the very memory addresses of the earth. I found a hidden pointer...',
      question: { text: 'What does the dereference operator `*` do when applied to a pointer variable `p`?', options: ['Gets the address of p', 'Gets the value stored at the address pointed to by p', 'Multiplies p', 'Deletes p'], correct: 1, explanation: 'The `*` operator accesses the value at the memory address the pointer holds.' } },
    { id: 'n10', name: 'Mira', role: 'Mayor', gender: 'Female', color: 0xffd700, size: [1, 1.05, 1], topic: 'Structures',
      dialogue: 'Our village records are complex entities. Someone modified a struct member!',
      question: { text: 'If `struct Citizen { int id; };` is configured, and you have a pointer `Citizen* c`, how do you access `id`?', options: ['c.id', 'c->id', 'c::id', '*c.id'], correct: 1, explanation: 'The arrow operator `->` is used to access members through a pointer to a struct.' } },
    { id: 'n11', name: 'Jorik', role: 'Scribe', gender: 'Male', color: 0x8a2be2, size: [0.95, 1, 0.95], topic: 'File I/O',
      dialogue: 'The archives were violently accessed. The perpetrator forced an unformatted write operation.',
      question: { text: 'Which standard stream is typically used to output error messages in C++?', options: ['cin', 'cout', 'cerr', 'cfile'], correct: 2, explanation: '`cerr` is the standard unbuffered error stream.' } },
    { id: 'n12', name: 'Elys', role: 'Scientist', gender: 'Female', color: 0x00ced1, size: [0.95, 1.05, 0.95], topic: 'Recursion',
      dialogue: 'A loop within a loop? No, a reflection reflecting itself until memory collapses.',
      question: { text: 'What is a critical requirement for a recursive function to prevent a stack overflow crash?', options: ['A return type of int', 'A loop construct', 'A base case to stop recursion', 'A pointer parameter'], correct: 2, explanation: 'A base case is logically necessary to stop recursion and begin returning.' } },
    { id: 'n13', name: 'Doran', role: 'Gravedigger', gender: 'Male', color: 0x2f4f4f, size: [1.1, 1.1, 1.1], topic: 'Memory',
      dialogue: 'I allocate plots dynamically. But someone forgot to free their memory, leaving a phantom trace.',
      question: { text: 'In C++, how do you deallocate an array created dynamically with `int* arr = new int[10];`?', options: ['delete arr;', 'free(arr);', 'delete[] arr;', 'remove arr;'], correct: 2, explanation: 'The `delete[]` operator is required to deallocate dynamically allocated arrays.' } },
    { id: 'n14', name: 'Sybil', role: 'Architect', gender: 'Female', color: 0xda70d6, size: [1, 1.05, 1], topic: 'OOP',
      dialogue: 'The blueprints of this village are encapsulated. A rogue agent broke the access modifiers.',
      question: { text: 'Which access modifier allows members to be accessible only within the class itself?', options: ['public', 'private', 'protected', 'internal'], correct: 1, explanation: '`private` members are only accessible from within the class defining them.' } },
    { id: 'n15', name: 'Orin', role: 'Clockmaker', gender: 'Male', color: 0xb8860b, size: [0.95, 0.95, 0.95], topic: 'Bitwise',
      dialogue: 'Tick, tock. The gears align at the bit level. The killer utilized a bitwise mask to alter the lock.',
      question: { text: 'What does the bitwise XOR operator `^` do?', options: ['Sets bit to 1 if both are 1', 'Sets bit to 1 if either is 1', 'Sets bit to 1 if bits are different', 'Inverts all bits'], correct: 2, explanation: 'XOR outputs 1 only when the corresponding bits in the operands strictly differ.' } }
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
    playFootstep() {
        if (this.muted || !this.settings.sfx || !this.ctx) return;
        const now = this.ctx.currentTime;
        if (now - this.lastFootstepTime < 0.35) return; 
        this.lastFootstepTime = now;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);

        filter.type = 'lowpass';
        filter.frequency.value = 250;

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(filter); filter.connect(gain); gain.connect(this.ctx.destination);
        osc.start(now); osc.stop(now + 0.1);
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
}
const audio = new AudioManager();

// ==========================================
// UI & DOM
// ==========================================
const ui = {
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
    toggleSfx: document.getElementById('toggle-sfx')
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

document.querySelectorAll('.scale-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        audio.init();
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

// Lighting (Time of Day system)
const colorSkyAfternoon = new THREE.Color(0x64748b);
const colorSkyDusk = new THREE.Color(0x0f172a);

const colorSunAfternoon = new THREE.Color(0xffe4b5);
const colorSunDusk = new THREE.Color(0x818cf8);

const colorAmbAfternoon = new THREE.Color(0x94a3b8);
const colorAmbDusk = new THREE.Color(0x475569);

const sunPosAfternoon = new THREE.Vector3(80, 50, 50);
const sunPosDusk = new THREE.Vector3(-50, 15, -30);

let environmentProgress = 0;

const ambientLight = new THREE.AmbientLight(colorAmbAfternoon, 0.6);
scene.add(ambientLight);

let dirLightColor = new THREE.Color().copy(colorSunAfternoon);
let dirLightIntensity = 1.2;

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
let buildMeshes = [];
let staticMeshes = [];
let activeParticles = [];

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
    activeParticles.forEach(p => scene.remove(p.mesh));
    buildMeshes = [];
    staticMeshes = [];
    npcMeshes = [];
    collidables = [];
    activeParticles = [];
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

    // Generate Houses
    const housePositions = [];
    const spread = size * 0.4;
    for(let i=0; i<numHouses; i++) {
        let hx = (Math.random() - 0.5) * spread * 2;
        let hz = (Math.random() - 0.5) * spread * 2;
        // Keep away from center origin and strictly paths
        if(Math.abs(hx) < 8) hx = hx > 0 ? hx + 8 : hx - 8;
        if(Math.abs(hz) < 8) hz = hz > 0 ? hz + 8 : hz - 8;
        
        buildHouse(hx, hz, 6 + Math.random()*3, 6 + Math.random()*3, 4 + Math.random()*2);
        housePositions.push({x: hx, z: hz});
    }

    // Generate Trees & Rocks
    const treeGeo = new THREE.CylinderGeometry(0.2, 0.5, 3);
    const leavesGeo = new THREE.ConeGeometry(2.5, 6, 5);
    const leafMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03 });
    
    for(let i=0; i<numHouses * 3; i++) {
        let x = (Math.random() - 0.5) * size;
        let z = (Math.random() - 0.5) * size;
        if(Math.abs(x) < 5 && Math.abs(z) < 5) continue;
        
        const grp = new THREE.Group();
        const trunk = new THREE.Mesh(treeGeo, trunkMat); trunk.position.y = 1.5; trunk.castShadow=true; trunk.receiveShadow=true;
        const leaves = new THREE.Mesh(leavesGeo, leafMat); leaves.position.y = 5; leaves.castShadow=true; leaves.receiveShadow=true;
        grp.add(trunk, leaves);
        grp.position.set(x, getTerrainHeight(x, z), z);
        scene.add(grp); staticMeshes.push(grp);
        collidables.push(new THREE.Box3().setFromObject(grp));
    }

    createNPCs(housePositions, size);
    
    scene.traverse((child) => {
        if (child.isMesh && child.material && child.material.isMeshStandardMaterial) {
            csm.setupMaterial(child.material);
        }
    });

    const camStartY = getTerrainHeight(0, 0) + 1.8;
    camera.position.set(0, camStartY, 0);
}

function buildHouse(x, z, w, d, h) {
    const group = new THREE.Group();
    
    // Base
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), baseMat);
    base.position.y = h/2;
    base.castShadow = true; base.receiveShadow = true;
    group.add(base);

    // Roof
    const roofH = h * 0.6;
    const roofMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b });
    const roof = new THREE.Mesh(new THREE.ConeGeometry(Math.max(w,d)*0.7, roofH, 4), roofMat);
    roof.position.y = h + roofH/2;
    roof.rotation.y = Math.PI/4;
    roof.castShadow = true; roof.receiveShadow = true;
    group.add(roof);

    // Door
    const doorMat = new THREE.MeshStandardMaterial({ color: 0x171717 });
    const door = new THREE.Mesh(new THREE.BoxGeometry(w*0.25, h*0.6, d+0.1), doorMat);
    door.position.y = (h*0.6)/2;
    group.add(door);

    // Windows (Glowing)
    const winMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xb45309, emissiveIntensity: 0.5 });
    const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(w+0.1, h*0.3, d*0.3), winMat);
    windowMesh.position.y = h*0.6;
    group.add(windowMesh);

    group.position.set(x, getTerrainHeight(x, z), z);
    // rotate randomly
    group.rotation.y = (Math.floor(Math.random()*4)) * (Math.PI/2);
    
    scene.add(group);
    buildMeshes.push(group);
    collidables.push(new THREE.Box3().setFromObject(group));
}

function createNPCs(housePosList, mapSize) {
    gameState.activeNPCs.forEach((n, i) => {
        const group = new THREE.Group();
        const sw = n.size[0], sh = n.size[1], sd = n.size[2];

        const bodyMat = new THREE.MeshStandardMaterial({ color: n.color });
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xffedd5 });
        const darkMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

        // Torso
        const torso = new THREE.Mesh(new THREE.BoxGeometry(0.8*sw, 1.2*sh, 0.4*sd), bodyMat);
        torso.position.y = 1.6*sh; torso.castShadow = true; group.add(torso);

        // Head
        const head = new THREE.Mesh(new THREE.BoxGeometry(0.5*sw, 0.5*sh, 0.5*sd), skinMat);
        head.position.y = 2.45*sh; head.castShadow = true; group.add(head);

        // Legs
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.3*sw, 1.0*sh, 0.3*sd), darkMat);
        legL.position.set(-0.2*sw, 0.5*sh, 0); legL.castShadow = true; group.add(legL);
        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.3*sw, 1.0*sh, 0.3*sd), darkMat);
        legR.position.set(0.2*sw, 0.5*sh, 0); legR.castShadow = true; group.add(legR);

        // Arms
        const armL = new THREE.Mesh(new THREE.BoxGeometry(0.2*sw, 1.0*sh, 0.2*sd), bodyMat);
        armL.position.set(-0.5*sw, 1.6*sh, 0); armL.castShadow = true; group.add(armL);
        const armR = new THREE.Mesh(new THREE.BoxGeometry(0.2*sw, 1.0*sh, 0.2*sd), bodyMat);
        armR.position.set(0.5*sw, 1.6*sh, 0); armR.castShadow = true; group.add(armR);

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
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

function checkInteractions() {
    if (!controls.isLocked) return;
    raycaster.setFromCamera(center, camera);
    const intersects = raycaster.intersectObjects(npcMeshes, true);
    selectedNPCId = null;
    ui.interactPrompt.classList.add('hidden');

    if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.distance < 4.5) {
            let obj = hit.object;
            while(obj.parent && !obj.userData.isNPC) obj = obj.parent;
            if (obj.userData && obj.userData.isNPC) {
                selectedNPCId = obj.userData.id;
                ui.interactPrompt.classList.remove('hidden');
                ui.npcName.textContent = getNPCContext(selectedNPCId).name; // preload
            }
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'KeyE' && controls.isLocked && selectedNPCId) {
        audio.playInteractionBeep();
        openDialogue(selectedNPCId);
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

document.addEventListener('keydown', (e) => {
    if (!gameState.gameActive) return;
    switch(e.code) { case 'KeyW': moveState.forward=true; break; case 'KeyA': moveState.left=true; break; case 'KeyS': moveState.backward=true; break; case 'KeyD': moveState.right=true; break; }
});
document.addEventListener('keyup', (e) => {
    if (!gameState.gameActive) return;
    switch(e.code) { case 'KeyW': moveState.forward=false; break; case 'KeyA': moveState.left=false; break; case 'KeyS': moveState.backward=false; break; case 'KeyD': moveState.right=false; break; }
});

function checkWallCollisions(newPosition) {
    const r = 1;
    const playerBox = new THREE.Box3(new THREE.Vector3(newPosition.x-r, 0, newPosition.z-r), new THREE.Vector3(newPosition.x+r, 3, newPosition.z+r));
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

    if (gameState.gameActive) {
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

        if (isMoving) audio.playFootstep();

        const currentPos = camera.position.clone();
        
        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        if (checkWallCollisions(camera.position)) camera.position.copy(currentPos);
        camera.position.y = getTerrainHeight(camera.position.x, camera.position.z) + 1.8; // Camera height

        checkInteractions();
        updateMinimap();
    }
    
    updateFootprints(delta);

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
