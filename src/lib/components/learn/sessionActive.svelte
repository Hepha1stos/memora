<script lang="ts">
	import { flashcardStore } from "$lib/stores/flashcardStore";
	import { Button,Alert } from "flowbite-svelte";
	import { onMount } from "svelte";
	import { get } from "svelte/store";
  import {type Writable} from "svelte/store";

  let flashcards = [];
  let cardIndex:number = 0;
  let answer:boolean = false;
  let correctAnswers:number;
  let wrongAnswers:number;
  let sessionEnds:boolean = false;
  let evalu:boolean = true;


  let sessionAnswers: { flashcardId: number; answered: boolean }[] = [];

  export let pickedCategoryId:number;
  export let isSessionOpen:Writable<boolean>;

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
    evalu = true
    correctAnswers =0;
    wrongAnswers =0 ;

    sessionAnswers.forEach((el) => {
      el.answered ? (correctAnswers+=1):(wrongAnswers+=1)
    })

  }
  if(cardIndex > flashcards.length){
    evaluate()
  }

  async function endSession(){
    let body ={category_id:pickedCategoryId, total_correct:correctAnswers, total_wrong: wrongAnswers, data:sessionAnswers}

    const response = await fetch("/api/learnSession/create",{
      method:'POST',
      body:JSON.stringify(body)
    })
    sessionEnds = true;
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
      {:else if answer}
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
    <Button type="button" color="green" class="w-1/2 mt-4" on:click={endSession}>End Session</Button> <!--todo-->
   {/if}
{:else}
   <p>Keine Flashcards gefunden</p>
{/if}

{#if sessionEnds}
			<div class="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
				<div class="w-1/3 rounded-lg  p-6 text-center">
					<Alert class="text-left" color="green">
						<span class="font-medium">Success!</span> The running Session is succsessfully saved!
						Continue?
						<div class="mt-4 flex justify-between">
							<Button
								type="button"
								color="green"
								class="w-1/3"
                on:click={() => {isSessionOpen.set(false)}}
							>
								Ok
							</Button>
						</div>
					</Alert>
				</div>
			</div>
		{/if}