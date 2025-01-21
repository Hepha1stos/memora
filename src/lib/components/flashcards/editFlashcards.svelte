<script lang="ts">
  import { categoryStore } from "$lib/stores/categoryStore";
  import { flashcardStore } from "$lib/stores/flashcardStore";
  import { get, writable } from "svelte/store";
  import { Button, Heading } from "flowbite-svelte";

  import ActiveEdit from "./activeEdit.svelte"

  let categories: Array<any> = [];
  let flashcards: Array<any> = [];
  let pickedCategoryId: number = 0;
  let flashcardsToEdit: Array<any> = [];
  let pickedCard;

  let openEdit = writable(false);
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

  function edit(card) {
    pickedCard = card;
    openEdit.set(true);
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

  function updateFlashcardStore(updatedFlashcard:any){
    flashcardStore.update(flashcards => {
      return flashcards.map(card => card.id === updatedFlashcard.id ? {...card, ...updatedFlashcard} : card);
    })
  }

  function formatTime(time: string) {
    const [year, month, day] = time.split("T")[0].split("-");
    return `${day}.${month}.${year}`;
  }
</script>

<Heading tag="h4" class="text-center text-2xl font-semibold mb-4 text-primary-600">Edit Flashcards</Heading>

<p class="mb-2 text-wrap text-base text-black font-medium">
  Select a Category and click <i>Edit</i> to change the Questions/Answers of a Flashcard or
  <i>Delete</i> to delete a Flashcard.
</p>

<!-- Kategorien-Auswahl -->
<select
  id="categories"
  class="focus:border-teal-500 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none"
  bind:value={pickedCategoryId}
>
 
  {#each categories as c}
    <option class="bg-white" value={c.id}>{c.name}</option>
  {/each}
</select>

<!-- Flashcards anzeigen -->
<div class="relative text-center overflow-auto h-[33rem] border-1 rounded-lg mt-2 p-2">
  {#if pickedCategoryId === 0}
    <p class="text-gray-500">Please select a Category</p>
  {:else if flashcardsToEdit.length <= 0}
    <p class="text-gray-500">This Category has no Flashcards</p>
  {/if}

  {#each flashcardsToEdit as card}
  <div class="mb-4 p-4  border border-gray-300 bg-gray-100 rounded-2xl shadow custom-hover-shadow transition-shadow duration-200 ease-in-out w-full">
    <span class="block font-semibold text-lg text-gray-800">Question:</span>
    <p class="mb-2 p-2 border-solid border-2 font-normal bg-[#FFFFFF] rounded-md flashcard-content">{card.question}</p>
    <span class="block font-semibold text-lg text-gray-800">Answer:</span>
    <p class="p-2 font-normal border-solid border-2 bg-[#FFFFFF] rounded-md flashcard-content">{card.answer}</p>
    <div class="flex justify-center gap-2 mt-4">
      <Button type="button" size="sm" color="alternative" on:click={() => { edit(card) }}>Edit</Button>
      <Button type="button" size="sm" color="red" on:click={() => deleteFlashcard(card)}>Delete</Button>
    </div>
</div>
  {/each}
</div>

{#if $openEdit}
<ActiveEdit {pickedCard} {openEdit} on:saveCard={updateFlashcardStore} />
{/if}

<style>
  .flashcard-content {
    white-space: pre-wrap;
    word-wrap: break-word;
    text-align: start;
  }

  
.custom-hover-shadow:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 20px 40px -5px rgba(0, 0, 0, 0.25);
}

</style>