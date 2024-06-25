<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLElement;

	// export let color = '#ffffff60'; // NOTE: unused
	export let active = false;
	export let size = 'auto';
	export let classes = '';
	export let href = '';

	$: className = `row-center cursor-pointer py-[5px] px-[15px] m-[2.5px] decoration-none inline-block border-[1px] border-solid border-[var(--border)] rounded-[20px] tracking-wider text-[0.9em] text-[var(--tertiary-text)] duration-[150ms] font-light  ${
		active
			? 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]'
			: 'bg-transparent hover:bg-[var(--main-hover)]'
	} ${classes}`;

	// $: {
	// 	if (el) {
	// 		el.style.setProperty('--border-color', color);
	// 		el.style.setProperty('--bg-color', color);
	// 	}
	// }

	onMount(() => {
		el.style.setProperty('--size', size);
	});
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<svelte:element
	this={href ? 'a' : 'button'}
	bind:this={el}
	{href}
	class={className}
	on:click
	on:keydown
	on:keypress
	on:keyup
>
	<slot />
</svelte:element>

<!-- TODO: define a new Chip for filter buttons in Projects, since these need a different background color -->
<!-- <style lang="scss">
	.chip {
		--border-color: transparent;
		--bg-color: transparent;
		
		// TODO: define new color for chip background that changes with dark mode
		background: var(--main); // TODO: change color so it is not so dark like the other cards

		&:hover {
			border-color: var(--border-hover);
		}
	}
</style> -->
