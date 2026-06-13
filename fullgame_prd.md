# Product Requirements Document: The Liar: Shadow Village

## 1. Executive Summary
**Project Name:** The Liar: Shadow Village
**Genre:** 3D First-Person Mystery / Detective Adventure
**Platform:** Web-based (WebGL/Three.js)

The player assumes the role of an investigator exploring a stylized village to uncover a saboteur among the townsfolk. Through interrogation, deduction, and environmental storytelling, the player must gather evidence and accuse the correct suspect.

## 2. Aesthetic Vision
### 2.1 Colors & Lighting
* **Environment Theme:** Stylized, low-poly aesthetic.
* **Lighting Cycle:** Dynamic day-to-dusk transitions.
    * *Afternoon:* Slate Gray (`#94a3b8`) sky and fog.
    * *Dusk/Night:* Deep Navy/Charcoal (`#0f172a`) sky and fog.
* **Terrain & Architecture:**
    * *Grass:* Deep Forest Green (`#0f4a25`).
    * *Roads:* Slate Gray (`#334155`).
    * *Buildings:* Earthy bases (`#e2e8f0`, `#d1d5db`) with red/brown roofs (`#7f1d1d`).
    * *Lanterns:* Emissive glowing yellow (`#fef08a`).

### 2.2 Typography
* **Primary Typeface:** 'Inter' sans-serif for UI clarity.
* **Styling:** Use of `.glow-text` for active states, minimal, clean dossier styling in menus, contrasting starkly with the atmospheric 3D world.

### 2.3 Environmental Controls
* **Weather Toggle:** A setting toggle accessed from the main menu allows the player to override dynamic weather (Auto) and manually set the environment to **Clear**, **Rainy**, or **Snowy**.

## 3. Gameplay Loop
1. **Explore:** Navigate the 3D village, discover locations, and experience atmospheric changes.
2. **Inspect:** Examine clutter (lanterns, crates) for flavor text. Heavy objects trigger a mild screen shake (`0.3` magnitude) simulating physical impact.
3. **Interrogate:** Speak to NPCs to answer trivia/logic deductions.
    * *Success:* Yields **Evidence Points** and triggers a golden particle clue effect.
    * *Failure:* Triggers a harsh error beep and changes the NPC's mood.
4. **Investigate:** Spend Evidence Points on hints and "Lie Scans" to uncover the Saboteur.
5. **Accuse:** Use the notebook to synthesize clues and accuse the final suspect. A massive screen shake (`1.2` magnitude) accompanies the fateful accusation.

## 4. UI/UX Design Specifications
* **Heads-Up Display (HUD):**
    * Minimalist center crosshair.
    * 2D minimap canvas showing paths (gray), player (white dot), and NPCs (colored dots).
    * Dynamic Interaction Prompt ("PRESS [E] TO INTERROGATE / INSPECT").
    * Centered bottom-third tooltips for location tagging.
* **Detective Notebook:** Glassmorphism overlay detailing Evidence Points, suspect cards, hints, and scan results.
* **Dialogue Overlay:** Lower-third dark panel with a dynamic 2D SVG portrait that shifts states based on the conversation context.

## 5. Character Animation States
### 5.1 First-Person Emotes (Player Arm Rig)
Triggered via hotkeys (`1-4`), a 3D arm rig moves into frame from the bottom screen:
* **[1] Waving:** Right arm rotates up, sine-wave side-to-side rotation.
* **[2] Pointing:** Right arm extends forward, locked at 45-degree angle.
* **[3] Thinking:** Right arm angles up to chin, rhythmic procedural bobbing.
* **[4] Nodding:** Both arms open outwards harmoniously.
* **Idle:** Procedural breathing/bobbing tied directly to player locomotion.

### 5.2 NPC 2D Portraits
Dynamic SVG portraits during interrogations swap expressions reactively:
* **Neutral:** Flat mouth, standard eyes.
* **Surprised:** Wide eyes, open round mouth (clue revealed!).
* **Suspicious:** Squinted eyes, angled eyebrows (wrong deduction).
* **Happy:** Arched eyes, smiling curve (cleared of suspicion).

## 6. Control Schemes
* **Locomotion:** WASD (Forward, Left, Backward, Right).
* **Look:** Mouse (PointerLock API).
* **Interact:** E (Interrogate NPC or Inspect Clutter).
* **Menu/Notebook & Pause:** TAB or ESC.
* **Emotes:** Numeric keys 1 (Wave), 2 (Point), 3 (Think), 4 (Nod).

## 7. Technical Architecture
### 7.1 Dialogue & Quiz System
* **Data Structure:** NPCs have context databases containing their designated role, dialog trees, and a rotating pool of questions.
* **State Machine:** Dialogue locks the PointerLock control, freezes time contextually, and toggles the UI dialogue screen overlay. 
* **Validation:** Player choices are validated against the current question state. Correct answers unlock hint branches; incorrect answers penalize and update the portrait state.

### 7.2 Evidence & Shop Handling
* **Evidence Engine:** Tracks the global Evidence Points variable.
* **Scan/Hint Purchase Mechanism:** Checks cost vs. points. Successful purchases update the global suspect dictionary, revealing `Truthful` or `Saboteur` status, permanently saving this flag in the Detective Notebook state UI.

### 7.3 Environmental Audio & Physics
* **Audio Generators:** Uses the Web Audio API for synthetic SFX (Footsteps: lowpass filters depending on path vs grass. Chirps, beeps, and wind).
* **Physics:** Box3 boundary collisions with wall-sliding algorithms, preventing clipping and maintaining fluid movement. Terrain uses simplex noise bounds for height mapping on the Y-axis.
