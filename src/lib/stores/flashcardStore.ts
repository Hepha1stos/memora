import { writable } from "svelte/store";

interface Flashcard {
  id: number;
  question: string;
  answer: string;
  category_id: string;
  created_at:Date;
  updated_at:Date;
  num_correct:number;
  num_wrong:number;
  user_id:string;
}

export const flashcardStore = writable<Flashcard[]>([]);
