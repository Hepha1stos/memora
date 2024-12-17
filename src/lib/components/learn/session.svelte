<script lang="ts">
	import { categoryStore } from '$lib/stores/categoryStore';
	import { flashcardStore } from '$lib/stores/flashcardStore';

	import { Button, Heading, Alert } from 'flowbite-svelte';
  import {InfoCircleSolid} from "flowbite-svelte-icons"
	import { get, type Writable } from 'svelte/store';
	import SessionActive from './sessionActive.svelte';

	export let isSessionOpen: Writable<boolean>;

	let categories = get(categoryStore);
	let start: boolean = false;
	let countedFlashcards = 0;
	let triggerAlertBack: boolean = false;
	let triggerAlertClose: boolean = false;

	let pickedCategoryId: number | null = null;

	function ChecktriggerAlertClose() {
		if (start) {
			// Eine aktive Session läuft
			triggerAlertClose = true;
		} else {
			// Keine Session aktiv, schließe direkt
			closeSession();
		}
	}

	function closeSession() {
		triggerAlertClose = false;
		isSessionOpen.set(false);
	}

	function count() {
		countedFlashcards = get(flashcardStore).filter((flashcard) => {
			return flashcard.category_id === pickedCategoryId;
		}).length;
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
	<div class="flex h-[45rem] w-1/2 flex-col items-center rounded-lg bg-white p-8 shadow-lg">
		{#if start}
			<Heading tag="h4" class="mb-1 text-center text-lg font-semibold">Learn Session</Heading>
			<SessionActive {pickedCategoryId} {isSessionOpen}/>
		{:else}
			<Heading tag="h4" class="mb-1 text-center text-lg font-semibold">Learning Session</Heading>
			<form class="mx-auto max-w-sm">
				Choose a Category and click "Start" <br /><br />
				<select
					id="categories"
					class="focus:border-teal block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"
					bind:value={pickedCategoryId}
					on:change={count}
				>
					<option selected>Select a Category</option>
					{#each categories as c}
						<option value={c.id}>{c.name}</option>
					{/each}
				</select>
				<br />
				{#if pickedCategoryId == null}
					<!----->
				{:else}
					You have {countedFlashcards}
					{countedFlashcards === 1 ? 'Flashcard' : 'Flashcards'} to learn<br />
					<Button
						type="button"
						class="mt-4 w-full"
						on:click={() => {
							start = true;
						}}>Start</Button
					>
				{/if}
			</form>
		{/if}
		<div class="mt-auto flex w-full justify-center">
			<Button type="button" color="alternative" class="w-1/3" on:click={ChecktriggerAlertClose}
				>Close</Button
			>
			{#if start}
				<Button
					type="button"
					color="alternative"
					class="ml-4 w-1/3"
					on:click={() => {
						triggerAlertBack = true;
					}}>Back</Button
				>
			{/if}
		</div>

		<!-- Alert for pressing Back Button -->
		{#if triggerAlertBack}
			<div class="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div class="w-1/3 rounded-lg  p-6 text-center">
					<Alert class="text-left">
            <InfoCircleSolid slot="icon" class="w-5 h-5" />
						<span class="font-medium">Attention!</span> The running Session will not be saved!
						Continue?
						<div class="mt-4 flex justify-between">
							<Button
								type="button"
								color="green"
								class="w-1/3"
								on:click={() => {
									start = false;
									triggerAlertBack = false;
								}}
							>
								Yes
							</Button>
							<Button
								type="button"
								color="red"
								class="w-1/3"
								on:click={() => {
									triggerAlertBack = false;
								}}
							>
								No
							</Button>
						</div>
					</Alert>
				</div>
			</div>
		{/if}

    <!-- Alert for pressing Close Button -->
		{#if triggerAlertClose}
			<div class="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div class="w-1/3 rounded-lg p-6 text-center">
					<Alert class="text-left">
            <InfoCircleSolid slot="icon" class="w-5 h-5" />
						<span class="font-medium">Attention!</span> The running Session will not be saved!
						Continue?
						<div class="mt-4 flex justify-between">
							<Button type="button" color="green" class="w-1/3" on:click={closeSession}>Yes</Button>
							<Button
								type="button"
								color="red"
								class="w-1/3"
								on:click={() => {
									triggerAlertClose = false;
								}}
							>
								No
							</Button>
						</div>
					</Alert>
				</div>
			</div>
		{/if}
	</div>
</div>
