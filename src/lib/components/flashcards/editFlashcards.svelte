<script lang="ts">
  import { categoryStore } from "$lib/stores/categoryStore";
  import { flashcardStore } from "$lib/stores/flashcardStore";
  import { get } from "svelte/store";
  import { Button, Heading } from "flowbite-svelte";

  let categories: Array<any> = [];
  let flashcards: Array<any> = [];
  let pickedCategoryId: number = 0;
  let flashcardsToEdit: Array<any> = [];

  // Kategorien abonnieren
  $: categoryStore.subscribe((value) => {
    categories = value;
  });

  // Flashcards abonnieren
  $: flashcardStore.subscribe((value) => {
    flashcards = value;
  });

  // Reaktivität erzwingen bei Änderung
  $: if (pickedCategoryId) {
    flashcardsToEdit = flashcards.filter(
      (card) => card.category_id === pickedCategoryId
    );
  }

  async function deleteFlashcard(card) {
    try {
      const response = await fetch("/api/flashcard/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: card.id })
      });

      if (!response.ok) {
        throw new Error(`Failed to delete flashcard: ${response.statusText}`);
      }

      // Aktualisiere flashcardStore
      flashcardStore.update((flashcards) =>
        flashcards.filter((flashcard) => flashcard.id !== card.id)
      );

      // Erzwinge manuelle Aktualisierung
      flashcards = get(flashcardStore);
      flashcardsToEdit = flashcards.filter(
        (f) => f.category_id === pickedCategoryId
      );
    } catch (error) {
      console.error(`Error deleting flashcard: ${error}`);
    }
  }

  function formatTime(time: string) {
    const [year, month, day] = time.split("T")[0].split("-");
    return `${day}.${month}.${year}`;
  }
</script>

<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Edit Flashcards</Heading>

<p class="mb-2 text-wrap text-sm text-gray-600 font-medium">
  Select a Category and click <i>Edit</i> to change the Questions/Answers of a Flashcard or
  <i>Delete</i> to delete a Flashcard.
</p>

<!-- Kategorien-Auswahl -->
<select
  id="categories"
  class="focus:border-teal block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"
  bind:value={pickedCategoryId}
>
  <option value="0" selected>Select a Category</option>
  {#each categories as c}
    <option value={c.id}>{c.name}</option>
  {/each}
</select>

<!-- Flashcards anzeigen -->
<div class="relative text-center overflow-auto h-[32rem] border-2 rounded-lg mt-4 p-4">
  {#if pickedCategoryId === 0}
    <p class="text-gray-500">Please select a Category</p>
  {:else if flashcardsToEdit.length <= 0}
    <p class="text-gray-500">This Category has no Flashcards</p>
  {/if}

  {#each flashcardsToEdit as card}
  <div class="mb-4 p-2 border rounded-lg shadow-sm hover:shadow-2xl duration-300 ease-in-out">
    <p class="font-semibold">Question: {card.question}</p>
    <p class="font-semibold">Answer: {card.answer}</p>
    <div class="flex justify-center mt-2">
      <Button type="button" size="xs" color="alternative">Edit</Button>
      <Button type="button" size="xs" color="red" class="ml-2" on:click={() => deleteFlashcard(card)}>Delete</Button>
    </div>
  </div>
  {/each}
</div>
