<script lang="ts">
	import { categoryStore } from "$lib/stores/categoryStore";
	import { Heading, Button, Alert } from "flowbite-svelte";
	import { InfoCircleSolid } from "flowbite-svelte-icons";
	import { writable } from "svelte/store";
	import ActiveEdit from "./activeEdit.svelte";
	import { flashcardStore } from "$lib/stores/flashcardStore";

	// Store für offene Edit-Komponente
	let openEdit = writable(false);
	let pickedCategory: any;
	let CategoryToDelete;
	let checkDelete: boolean = false;

	let categories: any = [];
	let flashcards: any = [];

	// Subscribe to stores
	$: categoryStore.subscribe(value => {
		categories = value;
	});

	$: flashcardStore.subscribe(value => {
		flashcards = value;
	});

	function openActiveEdit(cat: any) {
		pickedCategory = cat;
		openEdit.set(true);
	}

	function updateCategoryInStore(updatedCategory: any) {
		categoryStore.update(categories => {
			return categories.map(cat =>
				cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat
			);
		});
		window.location.reload();
	}

	function check(cat: any) {
		checkDelete = true;
		CategoryToDelete = cat;
	}

	async function deleteCategory() {
    try {
        const response = await fetch("/api/category/delete", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id: CategoryToDelete.id })
        });

        if (!response.ok) {
            throw new Error(`Failed to delete category: ${response.statusText}`);
        }

        // Entferne die Kategorie aus dem categoryStore
        categoryStore.update(categories => {
            return categories.filter(cat => cat.id !== CategoryToDelete.id);
        });

        // Entferne die zugehörigen Flashcards aus dem flashcardStore
        flashcardStore.update(flashcards => {
            return flashcards.filter(flashcard => flashcard.category_id !== CategoryToDelete.id);
        });

        checkDelete = false; // Schließe das Bestätigungs-Popup
        console.log("Category and associated flashcards deleted successfully");
    } catch (error) {
        console.error("Error deleting category and flashcards:", error);
    }
}

</script>

<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Edit Category</Heading>
<p class="text-gray-600 text-sm mb-6 text-wrap text-sm font-medium">
	Click <i>Edit</i> to change the Name of a Category or <i>Delete</i> to delete a Category and its Flashcards.
</p>

<div class="relative text-center overflow-auto h-[34rem] border-2 rounded-lg">
	{#each categories as cat}
	<div class="mb-4">
		<p class="font-semibold">{cat.name}</p>
		<p class="text-gray-600 text-sm">Flashcards: {flashcards.filter(f => f.category_id === cat.id).length}</p>
		<div class="mt-2 flex justify-center gap-2">
			<Button
				type="button"
				color="alternative"
				size="xs"
				on:click={() => openActiveEdit(cat)}
			>Edit</Button>
			<Button
				type="button"
				color="red"
				size="xs"
				on:click={() => { check(cat); }}
			>Delete</Button>
		</div>
		<hr class="mt-3" />
	</div>
	{/each}
</div>

{#if $openEdit}
	<ActiveEdit
		bind:openEdit
		{pickedCategory}
		on:updatedCategory={updateCategoryInStore}
	/>
{/if}

{#if checkDelete}
<div class="z-[9999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
	<div class="w-1/3 rounded-lg p-6 text-center">
		<Alert class="text-left">
			<InfoCircleSolid slot="icon" class="w-5 h-5" />
			<span class="font-medium">Attention!</span> Deleting this category will also delete all flashcards associated with it. Are you sure you want to proceed?
			<div class="mt-4 flex justify-between">
				<Button type="button" color="green" class="w-1/3" on:click={deleteCategory}>Yes</Button>
				<Button
					type="button"
					color="red"
					class="w-1/3"
					on:click={() => { checkDelete = false }}
				>No</Button>
			</div>
		</Alert>
	</div>
</div>
{/if}
