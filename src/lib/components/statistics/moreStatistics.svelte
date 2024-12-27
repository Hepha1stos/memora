<script lang="ts">
	import { Button, Heading, Input } from 'flowbite-svelte';
	import Linechart from '../charts/linechart.svelte';
  import { flashcardStore } from '$lib/stores/flashcardStore';
	import { categoryStore } from '$lib/stores/categoryStore';


	export let openStatistics: boolean;
  


	let categories;
  let flashcards;
	let pickedCategoryId: number;
	let pickedCategory: [];
	let xAxis = [];
	let yAxis = [];
	let yAxis2 = [];
  let mostWrongAnswered


	categoryStore.subscribe((value) => {
		categories = value;
	});

  flashcardStore.subscribe((value) => {
    flashcards = value;
  })

	async function loadLearnedSessions() {
		const res = await fetch('/api/learnSession/get', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const data = await res.json();
		console.log(data);
		pickedCategory = data['data'].filter((obj) => obj.category_id === pickedCategoryId);
		xAxis = pickedCategory.map((obj) =>
			new Date(obj.date).toLocaleDateString('en-GB', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			})
		);
		yAxis2 = pickedCategory.map((obj) => obj.total_correct + obj.total_wrong);
		yAxis = pickedCategory.map((obj) => obj.total_correct);
	}

  $: if (pickedCategory && pickedCategory.length > 0) {
    mostWrongAnswered = flashcards
        .filter((obj) => obj.category_id === pickedCategoryId)
        .sort((a, b) => b.total_wrong - a.total_wrong)[0];
}
</script>

<div class="fixed inset-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-60">
	<div class="flex h-[75%] w-[50%] flex-col items-center rounded-lg bg-white p-8 shadow-lg">
		More awesome statistics
		<select
			id="categories"
			class="focus:border-teal block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"
			bind:value={pickedCategoryId}
			on:change={loadLearnedSessions}
		>
			<option selected>Select a Category</option>
			{#each categories as c}
				<option value={c.id}>{c.name}</option>
			{/each}
		</select>
    {#if !pickedCategory}
      <p>No data available</p>
    {:else}
    <Linechart {xAxis} {yAxis} {yAxis2} />
    <p>Repetitions:{pickedCategory.length}</p>
    <div>
      <p>Picked Category ID: {pickedCategoryId}</p>
      <p>Picked Category Data: {JSON.stringify(mostWrongAnswered)}</p>
  </div>
    {/if}
		
		<Button
			type="button"
			color="alternative"
			class="mt-auto w-full"
			on:click={() => (openStatistics = false)}>Close</Button
		>
	</div>
</div>
