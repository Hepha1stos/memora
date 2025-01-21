<script lang="ts">
  export let user: { name: string; roleId: number; id: string } | null;
</script>


<div class="flex flex-col content-center mt-[-2rem]">
	<div class="flex justify-center"><img src="/assets/logo.png" alt="memora logo" /></div>
	<div class="mt-9 text-black text-center text-black-500 text-lg font-medium">
		Welcome back <span class="text-lg text-red-500">{user?.name}</span>! Ready to make today awesome with a fresh learning session?
	</div>
</div>