<script lang="ts">
  import {Button, Heading} from "flowbite-svelte"

  import { writable } from 'svelte/store';
	import Session from "./session.svelte";
  let isSessionOpen = writable(false);
  
  function openSession() {
		isSessionOpen.set(true);
	}
</script>

<div class="pt-7 flex flex-row items-center space-x-4 w-full">
  
	<div class="basis-2/3">
    <Heading tag="h4" class="text-center text-lg font-semibold mb-1">Start your Session</Heading>
		Start a new session by clicking the '<em>Start New Session</em>' to choose from a variety of
		flashcard categories. Pick one to get started on your learning journey!
	</div>
	<div class="basis-1/3 flex justify-end pr-[0.1rem]">
		<Button class="w-full" on:click={openSession}> Start New Session </Button>
	</div>
</div>

{#if $isSessionOpen}
			<Session {isSessionOpen}/>
		{/if}