<script lang="ts">
	import { Button, Heading, Card, Badge } from 'flowbite-svelte';
	import Linechart from '../charts/linechart.svelte';
	import { flashcardStore } from '$lib/stores/flashcardStore';
	import { categoryStore } from '$lib/stores/categoryStore';

	export let openStatistics: boolean;

	let categories;
	let flashcards;
	let pickedCategoryId: number = null;
	let pickedCategory = [];
	let xAxis = [];
	let yAxis = [];
	let yAxis2 = [];
	let mostWrongAnswered;
	let successRate = 0;

	categoryStore.subscribe((value) => {
		categories = value;
	});

	flashcardStore.subscribe((value) => {
		flashcards = value;
	});

	async function loadLearnedSessions() {
		if (!pickedCategoryId) return;

		const res = await fetch('/api/learnSession/get', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await res.json();
		pickedCategory = data['data'].filter((obj) => obj.category_id === pickedCategoryId);
		console.log("Picked Category:", pickedCategory);

		// Rechne die Erfolgsrate neu
		getSuccessRate();

		// Aktualisiere Diagrammdaten
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

	function getSuccessRate() {
		if (pickedCategory.length === 0) {
			successRate = 0;
			return;
		}

		const totalCorrect = pickedCategory.reduce((acc, obj) => acc + obj.total_correct, 0);
		const totalQuestions = pickedCategory.reduce((acc, obj) => acc + obj.total_correct + obj.total_wrong, 0);

		successRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
		console.log("Success Rate:", successRate);
	}

	$: if (flashcards && pickedCategoryId) {
		mostWrongAnswered = flashcards
			.filter((card) => card.category_id === pickedCategoryId)
			.reduce((prev, current) => (current.num_wrong > (prev?.num_wrong || 0) ? current : prev), null);
	}
</script>

<div class="fixed inset-0 z-50 flex w-full items-center justify-center bg-black bg-opacity-70">
	<div class="flex h-[90%] w-[60%] flex-col gap-6 rounded-lg bg-white p-8 shadow-lg overflow-y-auto">
		<Heading class="text-2xl font-bold text-gray-700 mb-4">Category Statistics</Heading>
		<select
			id="categories"
			class="focus:border-teal block w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-sm text-gray-900 focus:outline-none"
			bind:value={pickedCategoryId}
			on:change={loadLearnedSessions}
		>
			<option selected disabled>Select a Category</option>
			{#each categories as c}
				<option value={c.id}>{c.name}</option>
			{/each}
		</select>

		{#if !pickedCategory || pickedCategory.length === 0}
			<p class="text-lg text-gray-500 mt-4">No data available</p>
		{:else}
			<div class="w-full flex flex-col gap-4">
				<!-- Linechart Card -->
				<div class="w-full p-6 bg-white rounded-lg shadow-2xl">
					<h2 class="text-lg font-semibold text-gray-700 mb-4">Performance Chart</h2>
					<Linechart {xAxis} {yAxis} {yAxis2} />
				</div>

				<!-- Session Insights Card -->
				<div class="w-full p-6 bg-white rounded-lg shadow-2xl">
					<h2 class="text-lg font-semibold text-gray-700 mb-4">Session Insights</h2>
					<div class="flex flex-col gap-2">
						<p class="text-gray-700">
							<span class="font-medium text-blue-600">Success Rate:</span> {successRate}%
						</p>
						<p class="text-gray-700">
							<span class="font-medium text-blue-600">Repetitions:</span> {pickedCategory.length}
						</p>
						<p class="text-gray-700">
							<span class="font-medium text-blue-600">Category ID:</span> {pickedCategoryId}
						</p>
					</div>
				</div>

				<!-- Most Wrongly Answered Flashcard Card -->
				<div class="w-full p-6 bg-white rounded-lg shadow-2xl">
					<h2 class="text-lg font-semibold text-gray-700 mb-4">Most Wrongly Answered Flashcard</h2>
					<div class="flex flex-col gap-2">
						<p class="text-gray-700">
							<span class="font-medium text-red-600">Question:</span> {mostWrongAnswered?.question || 'N/A'}
						</p>
						<p class="text-gray-700">
							<span class="font-medium text-red-600">Answer:</span> {mostWrongAnswered?.answer || 'N/A'}
						</p>
						<p class="text-gray-700">
							<span class="font-medium text-red-600">Wrong Answers:</span> {mostWrongAnswered?.num_wrong || 0}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<Button
			type="button"
			color="alternative"
			class="mt-6 w-full"
			on:click={() => (openStatistics = false)}
		>
			Close
		</Button>
	</div>
</div>
