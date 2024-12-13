<script lang="ts">

  import {Button,Heading,Input} from "flowbite-svelte"

  export let openStatistics: boolean;
</script>


<div 
    class="fixed inset-0 flex justify-center items-center bg-black bg-opacity-60 z-50"
  >
    <div class="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center">
      More awesome statistics
      <Button type="button" class="w-full" on:click={() => (openStatistics = false)}>Close</Button>
    </div>
  </div>