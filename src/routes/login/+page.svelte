<script lang="ts">
  import { Input, Label, Button,Checkbox } from 'flowbite-svelte';
  import { Heading ,A} from "flowbite-svelte";
  import type {ActionData} from './$types';
	import { fade } from 'svelte/transition';



  let showPassword = false;
  let passwordType: "text" | "password" = "password";
  $: passwordType = showPassword ? "text" : "password";

  let showMessage = false;

  $: if (form?.error){
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    },2500)
  }

  export let form: ActionData;
</script>

<div class="h-screen w-full flex justify-center items-center">
  <form method="POST" action="?/login" class="flex flex-col bg-white p-9 rounded-lg shadow-lg">
    <Heading tag="h3" class="mb-4">Login</Heading>
    <div class="mb-4">
      <Input type="text" id="username" name="username" class="text-slate-500" placeholder="Username" required />
      <div class="flex items-center justify-between">
       <p></p> 
      <button type="button" class=" mt-4 text-sm center text-slate-500"><small>Forgot password?</small></button>
    </div>
      <Input type={passwordType} id="password" name="password" class="text-sm  text-slate-500"placeholder="Password" required />
      <div class="flex items-center mt-2">
        <Checkbox bind:checked={showPassword}/>
        <label for="show-password focus-none" class="text-sm ml-2 text-slate-500">Show password</label>
      </div>
      <Button type="submit" class="mt-4 w-full">Submit</Button>
    </div>

    {#if showMessage}
    <p class="mb-4 text-red-400" transition:fade>{form?.message}</p>
  {/if}
    <p>Not registered yet? Change it <A href="/register">here</A></p>
  </form>
  
</div>
