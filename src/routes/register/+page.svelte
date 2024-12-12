<script lang="ts">
	import { Input, Label, Button } from 'flowbite-svelte';
	import { Heading,A } from 'flowbite-svelte';
  import type {ActionData} from "./$types";
	import { fade } from 'svelte/transition';

  export let form: ActionData;
  let showMessage = false;

  $: if (form?.error){
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    },2500)
  }
</script>

<div class="flex h-screen w-full items-center justify-center bg-slate-200">
	<form
		method="POST"
		action="?/register"
		class="flex w-1/3 flex-col rounded-lg bg-white p-9 shadow-lg"
	>
		<Heading tag="h3" class="mb-4">Register</Heading>

		<div class="mb-4">
			<Input
				type="text"
				id="username"
				name="username"
				class="text-sm text-slate-500"
				placeholder="Username"
				required
			/>
			<Input
				type="email"
				id="email"
				name="email"
				class="text-sm text-slate-500 mt-5"
				placeholder="E-Mail"
				required
			/>
			<Input
				type="password"
				id="password"
				name="password"
				class="text-sm text-slate-500 mt-5"
				placeholder="Password"
				required
			/>
			<Input
				type="password"
				id="password_valid"
				name="password_valid"
				class="text-sm text-slate-500 mt-5"
				placeholder="Confirm Password"
				required
			/>

      {#if showMessage}
        <p class="mt-5"  transition:fade>{form?.message}</p>
      {/if}

			<Button type="submit" class="mt-4 w-full">Register</Button>
		</div>

		<p>Already registered? Login <A href="/login">here</A></p>
	</form>
</div>
