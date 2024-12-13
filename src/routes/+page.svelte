<script lang="ts">



  import {Button} from "flowbite-svelte"


  export let data: { user: { name: string; roleId: number; id: string } | null };


  // import components
  import Header from "$lib/components/landing/header.svelte";
	import CreateCategory from "$lib/components/categories/createCategory.svelte";
  import CreateFlashcards from "$lib/components/flashcards/createFlashcards.svelte";


  
</script>

<div
	class="m-1 grid h-screen grid-cols-3 grid-rows-10 gap-1 pb-3 md:grid-cols-4 md:grid-rows-4 md:gap-2"
>
	<div
		class="col-start-1 row-start-1 rounded-md bg-white p-10 md:col-span-1 md:col-start-1 md:row-span-1 md:row-start-1"
	></div>

	<div
		class="col-start-2 row-start-1  rounded-md bg-white p-10 md:col-span-2 md:col-start-2 md:row-span-1 md:row-start-1"
	><Header user={data?.user}/></div>
	<div
		class="col-start-3 row-start-1 flex justify-center items-center rounded-md bg-white p-10 md:col-span-1 md:col-start-4 md:row-span-1 md:row-start-1"
	><Button href="/logout">Logout</Button></div>
	<div
		class="col-span-3 col-start-1 row-start-2 rounded-md bg-white p-10 md:col-span-2 md:col-start-1 md:row-span-1 md:row-start-2"
	></div>
	<div
		class="col-span-3 col-start-1 row-span-2 row-start-3 rounded-md bg-white p-3 md:col-span-1 md:col-start-4 md:row-span-3 md:row-start-2"
	></div>
	<div
		class="col-span-3 col-start-1 row-span-2 row-start-5 rounded-md bg-white p-3 md:col-span-1 md:col-start-3 md:row-span-3 md:row-start-2"
	></div>
	<div
		class="col-span-3 col-start-1 row-span-2 row-start-7 rounded-md bg-white p-6 md:col-span-1 md:col-start-1 md:row-span-2 md:row-start-3"
	><CreateFlashcards user={data?.user}/></div>
	<div
		class="col-span-3 col-start-1 row-span-2 row-start-9 rounded-md bg-white p-7 md:col-span-1 md:col-start-2 md:row-span-2 md:row-start-3"
	><CreateCategory user={data?.user}/></div>
</div>
