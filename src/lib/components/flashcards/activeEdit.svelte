<script lang="ts">
	import { flashcardStore } from '$lib/stores/flashcardStore';
  import { Heading, Input, Button,Helper } from 'flowbite-svelte';
  import type {Writable} from 'svelte/store';
  flashcardStore


  export let pickedCard;
  export let openEdit:Writable<boolean>;

    let newQuestion = pickedCard?.question || '';
    let newAnswer = pickedCard?.answer || '';

  function closeEdit(){
    openEdit.set(false);
  }

async function saveCard(){
  try{
    let body = {
      id:pickedCard.id,
      question:newQuestion,
      answer:newAnswer
    }
    console.log(body)
    const response = await fetch("/api/flashcard/edit", {
      method: 'PATCH',
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(body)
    });
    const result = await response.json()

    flashcardStore.update(flashcards => {
      const card = flashcards.find(card => card.id === pickedCard.id);
      if (card){
        card.question = newQuestion;
        card.answer = newAnswer;
      }
      return flashcards;
    })
    openEdit.set(false);
   
  } catch(error){ 
    console.log(error);
  }
}
</script>

<div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
	<div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
		<Heading tag="h4" class="mb-4">Edit Flashcard</Heading>
		<p class="mb-4 text-gray-500">Modify your Flashcard details below.</p>
    <Helper id="name-helper" class="mb-2">Question</Helper>
		<Input
			type="text"
			placeholder={pickedCard.question}
      bind:value={newQuestion}
			class="mb-4 w-full"
		/>
    <Helper id="name-helper" class="mb-2">Answer</Helper>
		<Input
			type="text"
			placeholder={pickedCard.answer}
      bind:value={newAnswer}
			class="mb-4 w-full"
		/>
		<Button type="button" class="w-full mb-2" on:click={saveCard}>Save</Button>
		<Button type="button" class="w-full" on:click={closeEdit}>Close</Button>
	</div>
</div>