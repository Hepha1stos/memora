<script lang="ts">
	import { categoryStore } from '$lib/stores/categoryStore';
	import { flashcardStore } from '$lib/stores/flashcardStore';

	import { Heading, Button, Alert } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	let categories: Array<any>;
	let flashcards: Array<any>;
	let pickedCategoryId: number;
  let flashcardsToEdit:Array<any> = []

	$: categoryStore.subscribe((value) => {
		categories = value;
	});

	$: flashcardStore.subscribe((value) => {
		flashcards = value;
	});

  function loadFlashcards(){
    flashcardsToEdit = flashcards.filter((card)=> card.category_id === pickedCategoryId)
  }

  function formatTime(time:string){
    let formattedTime:string ="";
    let temp:Array<string>  = time.split("T")[0].split("-")
    let year = temp[0]
    let month = temp[1]
    let day = temp[2]
    return formattedTime = `${day}.${month}.${year}`
  }


  async function deleteFlashcard(){
    //body must have format: {id:1,flashcard:{question:"bababa"}}


  }
</script>

<Heading tag="h4" class=" text-center text-lg font-semibold">Edit Flashcards</Heading>
<p class="mb-2 text-wrap text-sm text-sm font-medium text-gray-600">
	Select a Category and click <i>Edit</i> to change the Questions/Answers of a Flashcard or
	<i>Delete</i> to delete a Flashcard.
</p>

<select
	id="categories"
	class="focus:border-teal block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:outline-none z-1"
	bind:value={pickedCategoryId}
  on:change={loadFlashcards}
>
	<option selected>Select a Category</option>
	{#each categories as c}
		<option value={c.id}>{c.name}</option>
	{/each}
</select>
<div class="relative text-center overflow-auto h-[32rem] border-2 rounded-lg">
  {#if pickedCategoryId === "Select a Category" }
  Please select a Category
  {:else if flashcardsToEdit.length <= 0}
    <p>This Category has no Flashcards</p>
{/if}
  {#each flashcardsToEdit as card}
    <div class="mb-2 border-1 gap-2">
     <p class="font-semibold">Question:{card.question}</p>
     <p class="font-semibold">Answer: {card.answer}</p>
     <p class="">Created at: {formatTime(card.created_at)}</p>
     <p class="">Updatet at: {formatTime(card.updated_at)}</p>
     <Button type="button" size="xs" color="alternative" class="">Edit</Button>
     <Button type="button" size="xs" color="red" class="">Delete</Button>
     <hr class="mt-3" />
    </div>
  {/each}

</div>