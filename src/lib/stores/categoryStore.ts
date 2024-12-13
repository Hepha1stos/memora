import { writable } from "svelte/store";

interface Category {
  id: number;
  name: string;
  studyCount: number;
  user_id: string;
}

export const categoryStore = writable<Category[]>([]);
