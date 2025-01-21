<script lang="ts">
	import { flashcardStore } from '$lib/stores/flashcardStore';
	import { Heading, Button, Helper, Textarea,Input } from 'flowbite-svelte';
	import type { Writable } from 'svelte/store';

	// Props
	export let pickedCard;
	export let openEdit: Writable<boolean>;

	// Lokale Variablen für die bearbeitete Frage und Antwort
	let newQuestion = pickedCard?.question || '';
	let newAnswer = pickedCard?.answer || '';

	// Funktion zum Schließen des Bearbeitungsdialogs
	function closeEdit() {
		openEdit.set(false);
	}

	// Funktion zum Speichern der Änderungen
	async function saveCard() {
		try {
			const body = {
				id: pickedCard.id,
				question: newQuestion,
				answer: newAnswer
			};

			// API-Anfrage zum Aktualisieren der Flashcard
			const response = await fetch('/api/flashcard/edit', {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(body)
			});
			const result = await response.json();

			// Lokale Store-Aktualisierung
			flashcardStore.update((flashcards) => {
				const card = flashcards.find((card) => card.id === pickedCard.id);
				if (card) {
					card.question = newQuestion;
					card.answer = newAnswer;
				}
				return flashcards;
			});
			openEdit.set(false);
		} catch (error) {
			console.error('Error saving card:', error);
		}
	}
</script>

<div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
	<div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center w-[35rem]">
		<Heading tag="h4" class="mb-4 text-2xl text-primary-600">Edit Flashcard</Heading>
		<p class="mb-4 text-black text-base font-medium">Modify your Flashcard details below.</p>

		<!-- Eingabefeld für die Frage -->
		<Helper id="question-helper" class="mb-2">Question</Helper>
		<Input
      type="text"
			bind:value={newQuestion}
			placeholder="Enter your question"
			id="question"
			name="question"
			class="mb-4 w-full"
		/>

		<!-- Eingabefeld für die Antwort -->
		<Helper id="answer-helper" class="mb-2">Answer</Helper>
		<Textarea
			bind:value={newAnswer}
			placeholder="Enter your answer"
			id="answer"
			name="answer"
			class="mb-4 w-full, h-[10rem]"
		/>

		<!-- Buttons -->
		<Button type="button" class="w-full mb-2 bg-green-700 save hover:bg-green-800" on:click={saveCard}>Save</Button>
		<Button type="button" class="w-full" on:click={closeEdit}>Cancel</Button>
	</div>
</div>
