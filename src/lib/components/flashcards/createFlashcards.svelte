<script lang="ts">
  interface Category {
  id: number;
  name: string;
  studyCount: number;
  user_id: string;
  value?:number;
}

  interface ApiResponse {
  error: boolean;
  message: string;
  data: Category[];
}

	import { loadAllCategories } from "$lib/funcs/api/handleAPI";
	import { categoryStore } from "$lib/stores/categoryStore";
 
  import {Input, Button, Heading,Helper, Select  } from "flowbite-svelte"
  import {Toast} from "flowbite-svelte";
  import {CheckCircleSolid, ExclamationCircleSolid} from "flowbite-svelte-icons";
	import { onMount } from "svelte";

  export let user: { name: string; roleId: number; id: string } | null;

  let data:ApiResponse = {
    error:false,
    message: "",
    data:[]
  };

  let selected:number = 0;
  let question:string;
  let answer:string; 
  let error:boolean = false;
  let errorMsg:string;

  onMount(async ()=>{
    const response = await loadAllCategories();
    categoryStore.set(response)

    // category_id muss den key 'value' haben -> jedes Kategoryobjekt wird mit Map antsprechend abgeändert
    data = {
        ...response,
        data: response.data.map((category: { id: any; }) => ({
          ...category,
          value: category.id 
        }))
      };
  })

  async function handleSubmit(){
    const response = await fetch('/api/flashcard/create',{
      method:'POST',
      body:JSON.stringify({user:user,data:{question:question,answer:answer, category_id:selected}})
    })
    const res = await response.json()

    if(response.ok){
      selected = 0;
      question = "";
      answer = ""
      error = res.error
      errorMsg = res.message
    }
}

</script>

<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Create a new Flashcard</Heading>

<p class="text-gray-600 text-sm mb-2 text-wrap">
  Create a new flashcard by entering your question and answer, and start learning right away
</p>
<form on:submit={handleSubmit} class="flex flex-col">
  <div>
    <Input type="text" id="question" name="question" placeholder="Enter the Question..." required bind:value={question}/>
    <Helper id="name-helper" class="mb-2">Choose a reasonable Question</Helper>
    <Input type="text" id="answer" name="answer" placeholder="Enter the Answer..." required bind:value={answer}/>
    <Helper id="name-helper"  class="mb-2">Do not forget the correct Answer</Helper>
    <Select items={data.data} bind:value={selected}/>
    <Helper id="name-helper"  class="mb-2">Select a proper Category</Helper>
    <Button type="submit" class="mt-4 w-full">Create Flashcard</Button>
  </div>
</form>

<!-- Toast für messages -->
<div class="flex items-center justify-center mt-2">
  {#if !error && errorMsg}
    
      <Toast color="green" class="shadow-2xl text-center rounded-2xl bg-green-100">
        <CheckCircleSolid slot="icon" class="w-6 h-6" />
        {errorMsg}
      </Toast>
   
  {:else if error && errorMsg}
  <Toast color="red" class="shadow-2xl text-center rounded-2xl bg-red-100">
    <ExclamationCircleSolid slot="icon" class="w-6 h-6" />
    {errorMsg}
  </Toast>
  {/if}
  </div>

