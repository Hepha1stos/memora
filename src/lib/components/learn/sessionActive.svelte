<script lang="ts">
	import { flashcardStore } from "$lib/stores/flashcardStore";
	import { Button } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { get } from "svelte/store";

  let flashcards = [];
  let cardIndex:number = 0;
  let answer:boolean = false;
  let correctAnswers:number;
  let wrongAnswers:number;

  let sessionAnswers: { flashcardId: number; answered: boolean }[] = [];

  export let pickedCategoryId:number;

  onMount(() => {
    flashcards = get(flashcardStore).filter((flashcard) => {
      return flashcard.category_id === pickedCategoryId;
    });
  });

  //funcs

  function handleKnown(){
    
    answer = false
    sessionAnswers.push({flashcardId:flashcards[cardIndex].id, answered:true})
    cardIndex += 1;
    // UPDATE flashcard
  }

  function handleNotKnown(){
    
    answer = false;
    sessionAnswers.push({flashcardId:flashcards[cardIndex].id, answered:false})
    cardIndex += 1;
  }

  function evaluate(){
    correctAnswers =0;
    wrongAnswers =0 ;

    sessionAnswers.forEach((el) => {
      el.answered ? (correctAnswers+=1):(wrongAnswers+=1)
    })

  }
  if(cardIndex > flashcards.length){
    evaluate()
  }

</script>

{#if flashcards.length > 0}
   {#if cardIndex < flashcards.length}
   <div class="border-4 hover:shadow-2xl ease-in-out duration-300  bg-slate-200 rounded-lg w-full h-1/6 text-center flex items-center justify-center">
    <p>{flashcards[cardIndex].question}</p>
  </div>
  <div class="border-1 hover:shadow-2xl ease-in-out duration-300 mt-2 bg-slate-100 rounded-lg w-full h-1/6 text-center flex items-center justify-center">
    <p></p>
    {#if answer}
        <p>{flashcards[cardIndex].answer}</p>
      {/if}
  </div>
      

      {#if !answer}
        <Button type="button" class="w-full mt-8" on:click={()=>{answer = true}}>Answer</Button>
      {:else}
        <Button type="button" color="green" class="w-full mt-4 mb-4" on:click={handleKnown}>Known</Button>
        <Button type="button" color="red" class="w-full" on:click={handleNotKnown}>Not Known</Button>
      {/if}
    {:else}
    <p>Evaluation</p>
    {evaluate()}
    <div>
      <div>
        Correct answers: {correctAnswers}
      </div>
      <div>
        Wrong answers: {wrongAnswers}
      </div>
    </div>
    <Button type="button" color="green" class="w-1/2 mt-4">End Session</Button> <!--todo-->
   {/if}
{:else}
   <p>Keine Flashcards gefunden</p>
{/if}