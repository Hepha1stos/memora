<script lang="ts">
	import { categoryStore } from "$lib/stores/categoryStore";
	import { flashcardStore } from "$lib/stores/flashcardStore";
	import { Heading,Button } from "flowbite-svelte";
  import { writable } from 'svelte/store'

	import MoreStatistics from "./moreStatistics.svelte";
  
  export const openStatisticsStore = writable(false);
	// Reaktive Variablen
	let categoryLen: number;
	let flashLen: number;
  let openStatistics: boolean = false; // Lokale Variable für die Bindung

	// Reaktive Zuordnung
	$: categoryLen = $categoryStore.length;
	$: flashLen = $flashcardStore.length;
</script>

<div class="h-full flex flex-col justify-between items-center space-y-4">
  <div class="flex space-x-14">
    <div class="flex-1">
      <Heading tag="h4" class="text-center text-lg font-semibold mb-4">Categories</Heading>
      <p>{categoryLen}</p>
    </div>
    <div class="flex-1">
      <Heading tag="h4" class="text-center text-lg font-semibold mb-4">Flashcards</Heading>
      <p>{flashLen}</p>
    </div>
  </div>
  <Button type="button" class="w-full" on:click={() => {openStatistics = true}}>Statistics</Button>
</div>



{#if openStatistics}
  <MoreStatistics bind:openStatistics/>
{/if}