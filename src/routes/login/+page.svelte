<script lang="ts">
  import { Input, Label, Button,Checkbox } from 'flowbite-svelte';
  import { Heading ,A} from "flowbite-svelte";
  import type {ActionData} from './$types';
	import { fade } from 'svelte/transition';



  let showPassword = false;
  let passwordType: "text" | "password" = "password";
  let forgotPassword:boolean = false;
  $: passwordType = showPassword ? "text" : "password";

  let showMessage = false;

  $: if (form?.error){
    showMessage = true;
    setTimeout(() => {
      showMessage = false;
    },2500)
  };


  export let form: ActionData;
</script>

<div class="h-screen w-full flex justify-center items-center">
  <form method="POST" action="?/login" class="flex flex-col bg-white p-9 rounded-lg shadow-lg">
    <Heading tag="h3" class="mb-4">Login</Heading>
    <div class="mb-4">
      <Input type="text" id="username" name="username" class="text-slate-500" placeholder="Username" required />
      <div class="flex items-center justify-between">
       <p></p> 
      
    </div>
    <div class="mt-4">
      <Input 
        type={passwordType} 
        id="password" 
        name="password" 
        class="text-sm text-slate-500" 
        placeholder="Password" 
        required 
      />
      <div class="flex items-start justify-between mt-2">
        <div class="flex items-center">
          <Checkbox bind:checked={showPassword} id="show-password" />
          <label for="show-password" class="text-sm ml-2 text-slate-500">
            Show password
          </label>
        </div>
        <button 
          type="button" 
          class="text-sm text-slate-500" 
          on:click={() => { forgotPassword = true }}
        >
          <small>Forgot password?</small>
        </button>
      </div>
    </div>
      <Button type="submit" class="mt-4 w-full">Submit</Button>
    </div>

    {#if showMessage}
    <p class="mb-4 text-red-400" transition:fade>{form?.message}</p>
  {/if}
    <p>Not registered yet? Change it <A href="/register">here</A></p>
    {#if forgotPassword}
  <div 
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      <Heading tag="h4" class="mb-4">Forgot your password?</Heading>
      <p class="mb-4 text-gray-500">We'll send you a link to reset your password.</p>
      <Input type="email" placeholder="Enter your email" class="mb-4 w-full" />
      <Button type="button" class="w-full mb-2">Send Reset Link</Button>
      <Button type="button" class="w-full" on:click={() => { forgotPassword = false }}>Close</Button>
    </div>
  </div>
{/if}

  </form>
  
  
</div>
