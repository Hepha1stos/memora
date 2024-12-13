import { writable } from "svelte/store";

interface User {
  name:string;
  roleId: number;
  id:string;
}

export const userStore = writable<User | null>(null);