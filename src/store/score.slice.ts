import { type StateCreator } from "zustand";

type IState = {
  score: number;
  totalScore: number;
  remainingChance: number;
  message: string;
};

type IActions = {
  setScore: (score: number) => void;
  resetScore: () => void;
  roll: () => void;
  setMessage: (message: string) => void;
};

export type IScoreSlice = IState & IActions;

const base: IState = {
  score: 0,
  totalScore: 0,
  remainingChance: 3,
  message: "",
};

const createScoreSlice: StateCreator<IScoreSlice> = (set, get) => ({
  ...base,
  setMessage: (message) => set({ message }),
  setScore: (score) => {
    set({ score, totalScore: get().totalScore + score });
  },
  roll: () => set({ remainingChance: get().remainingChance - 1 }),
  resetScore: () => set({ ...base }),
});

export default createScoreSlice;
