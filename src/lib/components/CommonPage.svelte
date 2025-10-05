<script>
	import { detectMobile } from '$lib/stores/navigation';
	import MainTitle from './MainTitle/MainTitle.svelte';
	import TabTitle from './TabTitle.svelte';

	let { title = $bindable('Title'), children } = $props();

	const isMobile = detectMobile();
</script>

<TabTitle bind:title />
<div id="divMainTitle" class="flex-1 col gap-5 px-2 sm:px-4 md:px-6 py-4 sm:py-8 md:py-12">
	{#if isMobile}
		<MainTitle>{title}</MainTitle>
	{:else}
		<MainTitle classes="py-10">{''}</MainTitle>
	{/if}

	<div class="col gap-5 flex-1">
		{@render children?.()}
	</div>
</div>
