<script lang="ts">
	import { flashcardStore } from '$lib/stores/flashcardStore';
	import { Button, Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { type Writable } from 'svelte/store';

	let flashcards: string | any[] = [];
	let cardIndex: number = 0;
	let answer: boolean = false;
	let correctAnswers: number = 0;
	let wrongAnswers: number = 0;
	let sessionEnds: boolean = false;
	let isEvaluated: boolean = false;
	let learnedSession: [];
	let sessionAnswers: { flashcardId: number; answered: boolean }[] = [];
	let countCategoryLearned: number;

	export let pickedCategoryId: number;
	export let isSessionOpen: Writable<boolean>;

	// Daten beim Mount laden
	onMount(async () => {
		console.log('Loading flashcards...');
		let allFlashcards = get(flashcardStore).filter((flashcard) => {
    //@ts-ignore
    return flashcard.category_id === pickedCategoryId;
  });

    flashcards = shuffleAndSortFlashcards(allFlashcards);


		const response = await fetch('/api/learnSession/get', {
			method: 'GET'
		});

		const learnedSessions = await response.json();

		learnedSession = learnedSessions.data.filter((el) => {
			return el.category_id == pickedCategoryId;
		});
		countCategoryLearned = learnedSession.length;
	});

	function handleKnown() {
		answer = false;
		sessionAnswers.push({ flashcardId: flashcards[cardIndex].id, answered: true });
		cardIndex += 1;

		if (cardIndex >= flashcards.length) {
			evaluate();
		}
	}

	function handleNotKnown() {
		answer = false;
		sessionAnswers.push({ flashcardId: flashcards[cardIndex].id, answered: false });
		cardIndex += 1;

		if (cardIndex >= flashcards.length) {
			evaluate();
		}
	}

	async function evaluate() {
  
		correctAnswers = 0;
		wrongAnswers = 0;

		sessionAnswers.forEach((el) => {
			el.answered ? (correctAnswers += 1) : (wrongAnswers += 1);
		});

		isEvaluated = true; // Zustand nach Evaluation setzen
	}

	async function endSession() {
  // JSON-Body für den PATCH-Request vorbereiten
  const updateBody = sessionAnswers.map((answer) => ({
    flashcardId: answer.flashcardId,
    answered: answer.answered,
  }));

  try {
    // 1. PATCH-Request: Flashcards aktualisieren
    const updateResponse = await fetch('/api/flashcard/update', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: updateBody }), 
    });

    const updateResult = await updateResponse.json();
    if (updateResult.error) {
      console.error('Error updating flashcards:', updateResult.message);
      return; 
    }
    console.log('Flashcards updated successfully:', updateResult.message);

    // 2. POST-Request: Lernsession speichern
    const sessionBody = {
      category_id: pickedCategoryId,
      total_correct: correctAnswers,
      total_wrong: wrongAnswers,
      data: sessionAnswers,
    };

    const sessionResponse = await fetch('/api/learnSession/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionBody), // Body für die Lernsession
    });

    const sessionResult = await sessionResponse.json();
    if (!sessionResult.error) {
      console.log('Learn session saved successfully:', sessionResult.message);
      sessionEnds = true; // Setze den Status, dass die Session abgeschlossen ist
      window.location.reload()
    } else {
      console.error('Error saving learn session:', sessionResult.message);
    }
  } catch (error) {
    console.error('Error during session ending:', error);
  }
}


function shuffleAndSortFlashcards(flashcards) {
  let weightedFlashcards = [];

  flashcards.forEach((flashcard) => {
    const total = flashcard.num_correct + flashcard.num_wrong;
    const ratio = total > 0 ? flashcard.num_correct / total : -1; // Setze ratio auf -1 für neue Flashcards

    // Berechne das Gewicht (je niedriger das Verhältnis, desto öfter wird es hinzugefügt)
    let copies = 1; // Standardmäßig wird die Karte einmal hinzugefügt

    if (total === 0) {
      // Neue Flashcards (noch nicht beantwortet)
      copies = 1;
    } else if (ratio > 0.2 && ratio <= 0.33) {
      copies = 2; // Füge zwei Kopien hinzu, wenn das Verhältnis schlecht ist (<= 33% und > 20%)
    } else if (ratio <= 0.2) {
      copies = 3; // Füge drei Kopien hinzu, wenn das Verhältnis sehr schlecht ist (<= 20%)
    }

    // Füge die Flashcard entsprechend ihrer Gewichtung hinzu
    for (let i = 0; i < copies; i++) {
      weightedFlashcards.push({
        ...flashcard,
        weight: 1 - ratio, // Gewicht zur Information beibehalten
      });
    }
  });

  // Mische die Flashcards zufällig
  weightedFlashcards = weightedFlashcards.sort(() => 0.5 - Math.random());

  return weightedFlashcards;
}


</script>

{#if flashcards.length > 0}
	{#if cardIndex < flashcards.length}
		<div
			class="flex h-1/6 w-full items-center justify-center rounded-lg border-4 bg-slate-200 text-center duration-300 ease-in-out hover:shadow-2xl"
		>
			<p>{flashcards[cardIndex].question}</p>
		</div>
		<div
			class="border-1 mt-2 flex h-1/6 w-full items-center justify-center rounded-lg bg-slate-100 text-center duration-300 ease-in-out hover:shadow-2xl"
		>
			{#if answer}
				<p>{flashcards[cardIndex].answer}</p>
			{/if}
		</div>
		{#if !answer}
			<Button
				type="button"
				class="mt-8 w-full"
				on:click={() => {
					answer = true;
				}}>Answer</Button
			>
		{:else if answer}
			<Button type="button" color="green" class="mb-4 mt-4 w-full" on:click={handleKnown}
				>Known</Button
			>
			<Button type="button" color="red" class="w-full" on:click={handleNotKnown}>Not Known</Button>
		{/if}
	{:else if !isEvaluated}
		<p>Loading evaluation...</p>
	{:else}
		<p>Evaluation</p>
		<div>
			<div>Correct answers: {correctAnswers}</div>
			<div>Wrong answers: {wrongAnswers}</div>
			<div>Learn session right/wrong ratio: 
        {#if (correctAnswers + wrongAnswers) > 0}
          {((correctAnswers / (correctAnswers + wrongAnswers)) * 100).toFixed(0)}%
        {:else}
          0%
        {/if}</div>
			<div>Category repetitions: {countCategoryLearned}</div>
		</div>
		<Button type="button" color="green" class="mt-4 w-1/2" on:click={endSession}>End Session</Button
		>
	{/if}
{:else}
	<p>Keine Flashcards gefunden</p>
{/if}

{#if sessionEnds}
	<div class="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
		<div class="w-1/3 rounded-lg p-6 text-center">
			<Alert class="flex- justify-between" color="green">
				<span class="font-medium">Success!</span> The running Session is successfully saved!
				Continue?
				<div class="mt-4 flex justify-center">
					<Button
						type="button"
						color="green"
						class="w-1/3"
						on:click={() => {
							isSessionOpen.set(false);
						}}
					>
						Ok
					</Button>
				</div>
			</Alert>
		</div>
	</div>
{/if}
