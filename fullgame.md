# Shadows of the Village: A 3D Detective Adventure

## 🕵️‍♂️ Overview
This is a **3D First-Person Detective / Mystery Adventure** game built with WebGL and Three.js. The player steps into the shoes of an investigator who has arrived at a secluded, stylized village to solve a crime. You must talk to the townsfolk, gather evidence, untangle lies, and ultimately accuse the correct suspect before it's too late.

## 🌟 Key Features

### 1. Dynamic 3D Environment
* **Living Village:** Explore a 3D village complete with houses, stylized trees, bushes, and scattered clutter (crates, lanterns, barrels) that you can inspect for hidden context.
* **Atmospheric Polish:** Features a day-to-dusk lighting cycle with dynamic weather (rain that slowly shifts into light snow), drifting clouds, flying birds, and dynamic footprints that track your movement across the terrain. 
* **Immersive Audio:** Dynamic footstep sounds that adapt linearly. Walking on roads has a crisp tempo, while traversing the village grass carries a distinct, softer resonance.
* **Expressive Emotes:** Trigger real-time 3D first-person hand animations (waving, pointing, thinking, nodding) via hotkeys (1-4).

### 2. Deep Interrogation System
* **Suspect Interviews:** Approach NPCs around the town to interrogate them. Each NPC has a designated role (e.g., Mayor, Librarian, Baker).
* **Reactive Character Portraits:** During dialogue, a 2D portrait system reacts to the conversation. NPCs will look *neutral* by default, *surprised* when you expose a clue, *suspicious* if you make a wrong deduction, or *happy* if you clear them.
* **Logic & Trivia:** Interrogations require you to solve deductions or answer questions. Guessing wrong penalizes you, while getting it right rewards you with clues.

### 3. Evidence & Investigation 
* **Evidence Points:** Correct deductions reward you with Evidence Points. 
* **Hint System:** If you get stuck on a suspect's alibi, you can spend 20 Evidence Points to buy a hint and force a confession.
* **Particle Clues:** A visually rewarding particle scatter effect fires off when you successfully extract a clue from an NPC.
* **Flavor Text Integration:** Inspect environmental objects (like flickering lanterns or old barrels) for lore bites that deepen the game's mystery.

### 4. The Accusation
* **Detective's Notebook:** Keep track of the suspects, their alibis, and the clues you've uncovered in your Notebook (Toggleable via Tab/Escape).
* **Final Verdict:** Use your accumulated evidence to point the finger at the guilty party in the Accusation Screen. Choose wisely—the village's fate is in your hands!

## 🎮 Controls
* **WASD:** Move around the village.
* **Mouse:** Look around.
* **[E]:** Interact with NPCs (Interrogate) or Clutter (Inspect).
* **[TAB] / [ESC]:** Open Detective's Notebook / Pause.
