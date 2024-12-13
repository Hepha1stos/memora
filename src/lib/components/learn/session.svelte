<script lang="ts">
	import { categoryStore } from '$lib/stores/categoryStore';
	import { flashcardStore } from '$lib/stores/flashcardStore';
  
	import { Button, Heading } from 'flowbite-svelte';
	import { get, type Writable } from 'svelte/store';
	import SessionActive from './sessionActive.svelte';

	export let isSessionOpen: Writable<boolean>;

	let categories = get(categoryStore);
	let start:boolean = false;
	let countedFlashcards = 0;

	let pickedCategoryId:number;

	function closeSession() {
		isSessionOpen.set(false);
	}


  function count(){
    countedFlashcards = get(flashcardStore).filter((flashcard) => {
			return flashcard.category_id === pickedCategoryId;
		}).length;
  }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
	<div class="flex h-1/2 w-1/2 flex-col items-center rounded-lg bg-white p-8 shadow-lg">
		{#if start}
			<Heading tag="h4" class="mb-1 text-center text-lg font-semibold">Learn Session</Heading>
			<SessionActive {pickedCategoryId}/>
		{:else}
    <Heading tag="h4" class="mb-1 text-center text-lg font-semibold">Learning Session</Heading>
    <form class="max-w-sm mx-auto">
      Choose a Category and click "Start" <br /><br />

      <select
					id="categories"
					class="bg-gray-50 border border-gray-300 ocus:outline-none focus:border-teal text-gray-900 text-sm rounded-lg block w-full p-2.5"
					bind:value={pickedCategoryId}
					on:change={count}
				>
        <option selected>Select a Category</option>
        {#each categories as c}
          <option value={c.id}>{c.name} </option>
        {/each}
      </select>
      <br>
      You have {countedFlashcards}
				{countedFlashcards === 1 ? 'Flashcard' : 'Flashcards'} to learn<br />
        <Button type="button" class="w-full" on:click={()=> {start = true}}>Start</Button>
    </form>
		{/if}
    <Button type="button" class="w-1/3" on:click={closeSession}>Close</Button>
	</div>
</div>
