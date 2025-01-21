<script lang="ts">
	import { Button, Input, Heading } from "flowbite-svelte";
	import { categoryStore } from "$lib/stores/categoryStore";
	import type { Writable } from "svelte/store";


	// Props
	export let openEdit:Writable<boolean>;
    //@ts-ignore
	export let pickedCategory;

	let newName: string = pickedCategory.name;

	async function updateCategory() {
		try {
			const body = {
        //@ts-ignore
				id: pickedCategory.id,
				name: newName
			};

			const response = await fetch("/api/category/update", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			});

			if (response.ok) {
				const res = await response.json();

				if (!res.error) {
					// Update direkt im Store
					categoryStore.update(categories => {
            //@ts-ignore
						const category = categories.find(cat => cat.id === pickedCategory.id);
						if (category) {
							category.name = newName; // Direkte Mutation
						}
						return categories;
					});

					// Modal schließen
					openEdit.set(false);
				} else {
					console.error("API Error:", res.message);
				}
			} else {
				console.error("API Request failed");
			}
		} catch (err) {
			console.error("Update Error:", err);
		}
	}
</script>

<div class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
	<div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
		<Heading tag="h4" class="mb-4 text-primary-600 text-center">Edit Category</Heading>
		<p class="mb-4 text-gray-500 text-black-400 font-medium text-base">Modify your category details below.</p>
		<Input
			type="text"
			placeholder="Enter new category name"
			bind:value={newName}
			class="mb-4 w-full"
		/>
		<Button type="button" class="w-full mb-2 bg-green-700 save hover:bg-green-800" on:click={updateCategory}>Save</Button>
		<Button type="button" class="w-full" on:click={() => openEdit.set(false)}>Cancel</Button>
	</div>
</div>
