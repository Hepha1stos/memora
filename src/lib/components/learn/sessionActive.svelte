<script lang="ts">
	import { flashcardStore } from "$lib/stores/flashcardStore";
	import { Button } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { get } from "svelte/store";

  let flashcards = [];
  let cardIndex:number = 0;
  let answer:boolean = false;



  export let pickedCategoryId:number;

  onMount(() => {
    flashcards = get(flashcardStore).filter((flashcard) => {
      return flashcard.category_id === pickedCategoryId;
    });
  });

  //funcs

  function handleKnown(){
    cardIndex += 1;
    answer = false
    // UPDATE flashcard
  }

  function handleNotKnown(){
    cardIndex += 1;
    answer = false;
  }
 
</script>


{#if flashcards.length > 0}
   {#if cardIndex < flashcards.length}
    <p>{flashcards[cardIndex].question}</p>
      {#if answer}
        <p>{flashcards[cardIndex].answer}</p>
      {/if}

      {#if !answer}
        <Button type="button" class="w-full" on:click={()=>{answer = true}}>Answer</Button>
      {:else}
        <Button type="button" color="green" class="w-full mt-4 mb-4" on:click={handleKnown}>Known</Button>
        <Button type="button" color="red" class="w-full" on:click={handleNotKnown}>Not Known</Button>
      {/if}
    {:else}
    <p>Endegelende</p>
    <Button type="button" color="green" class="w-1/2">End Session</Button> <!--todo-->
   {/if}
{:else}
   <p>Keine Flashcards gefunden</p>
{/if}