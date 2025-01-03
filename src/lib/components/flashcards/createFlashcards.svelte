<script lang="ts">
  import { flashcardStore } from "$lib/stores/flashcardStore";
  import { categoryStore } from "$lib/stores/categoryStore";

  import { Input, Button, Heading, Helper, Select,Textarea } from "flowbite-svelte";
  import { Toast } from "flowbite-svelte";
  import { CheckCircleSolid, ExclamationCircleSolid } from "flowbite-svelte-icons";
  import { fade } from "svelte/transition"; // Import der Fade-Transition

  export let user: { name: string; roleId: number; id: string } | null;

  let selected: number = 0;
  let question: string = "";
  let answer: string = ""; 
  let error: boolean = false;
  let errorMsg: string = "";
  let categories = [];
  let showToast = false; // State für die Anzeige des Toasts

  $: categories = $categoryStore.map(category => ({
    ...category,
    value: category.id
  }));

  async function handleSubmit(event: Event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/flashcard/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: user,
          data: {
            question: question,
            answer: answer,
            category_id: selected
          }
        })
      });

      const res = await response.json();

      if (res.error === false) {
        // Felder zurücksetzen
        selected = 0;
        question = "";
        answer = "";
        error = false;
        errorMsg = res.message;

        // Flashcard in den flashcardStore einfügen
        flashcardStore.update(flashcards => [
          ...flashcards,
          {
            id: res.newFlashcard.id,
            question: res.newFlashcard.question,
            answer: res.newFlashcard.answer,
            category_id: res.newFlashcard.category_id,
            created_at: new Date(res.newFlashcard.created_at),
            updated_at: new Date(res.newFlashcard.updated_at),
            num_correct: res.newFlashcard.num_correct || 0,
            num_wrong: res.newFlashcard.num_wrong || 0,
            user_id: user!.id
          }
        ]);

        // Toast anzeigen und nach 3 Sekunden ausblenden
        showToast = true;
        setTimeout(() => {
          showToast = false;
        }, 3000);
      } else {
        error = true;
        errorMsg = res.message;

        // Fehler-Toast anzeigen und nach 3 Sekunden ausblenden
        showToast = true;
        setTimeout(() => {
          showToast = false;
        }, 3000);
      }
    } catch (err) {
      console.error("Error creating flashcard:", err);
      error = true;
      errorMsg = "An error occurred while creating the flashcard.";

      // Fehler-Toast anzeigen und nach 3 Sekunden ausblenden
      showToast = true;
      setTimeout(() => {
        showToast = false;
      }, 3000);
    }
  }
</script>

<Heading tag="h4" class="text-center text-lg font-semibold mb-4">Create a new Flashcard</Heading>

<p class="text-gray-600 text-sm font-medium mb-2 text-wrap">
  Create a new flashcard by entering your question and answer, and start learning right away
</p>
<div class="relative flex flex-col items-center">
  <!-- Formular -->
  <form on:submit={handleSubmit} class="flex flex-col w-full">
    <div>
      <Input
        type="text"
        id="question"
        name="question"
        placeholder="Enter the Question..."
        required
        bind:value={question}
      />
      <Helper id="name-helper" class="mb-2">Choose a reasonable Question</Helper>
      <Textarea
        id="answer"
        name="answer"
        placeholder="Enter the Answer..."
        bind:value={answer}
        class="w-full p-2 border rounded"
        style="resize: none; height: 100px; overflow-y: auto;"
      />
      <Helper id="name-helper" class="mb-2">Do not forget the correct Answer</Helper>
      <Select items={categories} bind:value={selected} />
      <Helper id="name-helper" class="mb-2">Select a proper Category</Helper>
      <Button type="submit" class="mt-4 w-full">Create Flashcard</Button>
    </div>
  </form>

  <!-- Toast -->
  {#if showToast}
    <div
    in:fade={{ duration: 300 }} out:fade={{ duration: 300 }}
      class="absolute top-0 left-0 flex items-center justify-center w-full h-full z-50"
    >
      <Toast
        class={`shadow-2xl text-center rounded-2xl p-4 ${
          error ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }`}
      >
        {#if !error}
          <CheckCircleSolid class="w-6 h-6" />
          {errorMsg}
        {:else}
          <ExclamationCircleSolid class="w-6 h-6" />
          {errorMsg}
        {/if}
      </Toast>
    </div>
  {/if}
</div>
