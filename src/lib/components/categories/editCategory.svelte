<script lang="ts">
	import { categoryStore } from "$lib/stores/categoryStore";
	import { Heading, Button } from "flowbite-svelte";

	// Direkter Zugriff auf den Store
	let categories = [];

	$: {
		categoryStore.subscribe((value) => {
			categories = value;
		});
	}
</script>

<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Edit Category</Heading>
<p class="text-gray-600 text-sm mb-6 text-wrap text-sm font-medium">
  Click <i>Edit</i> to change the Name of a Category or <i>Delete</i> to delete a Category and its Flashcards.
</p>

<div class="relative text-center overflow-auto h-[34rem] border-2 rounded-lg">
  {#each categories as cat}
  <div class="mb-2">
    <p>{cat.name}</p>
    <Button type="button" color="alternative" class="mb-2" size="xs">Edit</Button>
    <Button type="button" color="red" class="mb-2" size="xs">Delete</Button>
    <hr />
  </div>
  {/each}
</div>
