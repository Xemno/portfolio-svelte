<script>
	import MainTitle from './MainTitle/MainTitle.svelte';
	import TabTitle from './TabTitle.svelte';

	/** @type {{title?: string, children?: import('svelte').Snippet}} */
	let { title = $bindable('Title'), children } = $props();
</script>

<TabTitle bind:title />
<div id="divMainTitle" class="flex-1 col gap-5 px-2 sm:px-4 md:px-6 py-4 sm:py-8 md:py-12">
	<MainTitle>{title}</MainTitle>
	<div class="col gap-5 flex-1">
		{@render children?.()}
	</div>
</div>
