<script lang="ts">
	

  import {Input, Button, Heading,Helper } from "flowbite-svelte"
  import {Toast} from "flowbite-svelte";
  import {CheckCircleSolid, ExclamationCircleSolid} from "flowbite-svelte-icons";
  import { categoryStore } from "$lib/stores/categoryStore";


  export let user: { name: string; roleId: number; id: string } | null;

  let categoryName:string;
  let error:boolean = false;
  let successMsg:string;

  async function handleSubmit(){
    const response = await fetch("/api/category/create", {
      method:"POST",
      body:JSON.stringify({user:user, data:categoryName})
    })
    const res = await response.json()

    if (response.ok){
      error = res.error;
      successMsg = res.message
      categoryName = "";
      categoryStore.update((categories) => [...categories, res.newCategory]);
    }
  };

</script>
<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Create a new Category</Heading>

<p class="text-gray-600 text-sm mb-6 text-wrap text-sm font-medium">
  Organize your Flashcards better by creating a new category!
</p>
<form on:submit={handleSubmit} class="flex flex-col">
  <div>
    <Input type="text" id="name" name="name" class="mt-4" bind:value={categoryName} placeholder="Enter the Categoryname" required />
    <Helper id="name-helper">Choose a unique and descriptive name</Helper>
    <Button type="submit" class="mt-4 w-full">Create Category</Button>
  </div>
</form>

<!-- Toast für messages -->
<div class="flex items-center justify-center mt-4">
{#if !error && successMsg}
  
    <Toast color="green" class="shadow-2xl text-center rounded-2xl bg-green-100">
      <CheckCircleSolid slot="icon" class="w-6 h-6" />
      {successMsg}
    </Toast>
 
{:else if error && successMsg}
<Toast color="red" class="shadow-2xl text-center rounded-2xl bg-red-100">
  <ExclamationCircleSolid slot="icon" class="w-6 h-6" />
  {successMsg}
</Toast>
{/if}
</div>