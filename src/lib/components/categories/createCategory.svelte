<script lang="ts">
  import { Input, Button, Heading, Helper } from "flowbite-svelte";
  import { Toast } from "flowbite-svelte";
  import { CheckCircleSolid, ExclamationCircleSolid } from "flowbite-svelte-icons";
  import { categoryStore } from "$lib/stores/categoryStore";
  import { get } from "svelte/store";
  import { fade } from "svelte/transition";

  export let user: { name: string; roleId: number; id: string } | null;

  let categoryName: string = "";
  let error: boolean = false;
  let successMsg: string = "";
  let errorMsg: string = "";
  let showToast = false; // State für die Anzeige des Toasts

  async function handleSubmit(event: Event) {
    event.preventDefault();

    try {
      const response = await fetch("/api/category/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: user, data: categoryName }),
      });

      if (!response.ok) {
        throw new Error("Server response was not OK");
      }

      const res = await response.json();

      if (res.error === false) {
        error = false;
        successMsg = res.message;
        errorMsg = "";
        categoryName = ""; // Reset des Input-Feldes

        // Aktualisierung des Stores
        categoryStore.update((categories) => {
          const existingCategories = get(categoryStore); // aktueller Zustand des Stores
          return [...existingCategories, res.newCategory]; // neue Kategorie hinzufügen
        });
      } else {
        error = true;
        errorMsg = res.message || "Ein Fehler ist aufgetreten.";
        successMsg = "";
      }

      // Toast anzeigen und nach 3 Sekunden ausblenden
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 3000);
    } catch (err) {
      console.error("Fehler beim Erstellen der Kategorie:", err);
      error = true;
      successMsg = "";
      errorMsg = "Es ist ein Fehler aufgetreten.";
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
  }
</script>

<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Create a new Category</Heading>

<p class="text-gray-600 text-sm mb-6 text-wrap text-sm font-medium">
  Organize your Flashcards better by creating a new category!
</p>

<form on:submit={handleSubmit} class="flex flex-col">
  <div>
    <Input
      type="text"
      id="name"
      name="name"
      class="mt-4"
      bind:value={categoryName}
      placeholder="Enter the Categoryname"
      required
    />
    <Helper id="name-helper">Choose a unique and descriptive name</Helper>
    <Button type="submit" class="mt-4 w-full">Create Category</Button>
  </div>
</form>

<!-- Toast mit Transition -->
<div class="flex items-center justify-center mt-2">
  {#if showToast}
    <div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}>
      <Toast
        class={`shadow-2xl text-center rounded-2xl ${
          error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
      >
        {#if !error}
          <CheckCircleSolid class="w-6 h-6" />
          {successMsg}
        {:else}
          <ExclamationCircleSolid class="w-6 h-6" />
          {errorMsg}
        {/if}
      </Toast>
    </div>
  {/if}
</div>
