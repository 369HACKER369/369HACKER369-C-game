export type TruthStatus = 'Truth' | 'Liar' | 'Neutral';

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  gender: 'Male' | 'Female';
  topic: string;
  personality: string;
  introDialogue: string;
  question: Question;
}

export interface NpcProgress {
  talkedTo: boolean;
  questionPassed: boolean;
  failedAttempts: number;
  scanned: boolean; // if true, TruthStatus is revealed via lie detector
}

export interface GameState {
  screen: 'start' | 'intro' | 'village' | 'dialogue' | 'notebook' | 'accusation' | 'result';
  criminalId: string;
  npcTruthStatuses: Record<string, TruthStatus>;
  npcHints: Record<string, string>;
  evidencePoints: number;
  npcProgress: Record<string, NpcProgress>;
  currentNpcId: string | null;
  win: boolean | null;
}
