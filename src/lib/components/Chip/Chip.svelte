<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLElement;

	interface Props {
		active?: boolean;
		size?: string;
		classes?: string;
		href?: string;
		onclick?: () => void;
		children?: import('svelte').Snippet;
	}

	let {
		active = false,
		size = 'auto',
		classes = '',
		href = '',
		onclick,
		children
	}: Props = $props();

	let className = ` row-center cursor-pointer py-[5px] px-[15px] m-[2.5px] decoration-none inline-block border-[1px] border-solid border-[var(--border)] rounded-[20px] tracking-wider text-[0.9em] text-[var(--tertiary-text)] duration-[150ms] font-light  ${
		href ? 'chip' : ''
	} ${classes}`;

	onMount(() => {
		el.style.setProperty('--size', size);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element this={href ? 'a' : 'button'} bind:this={el} {href} class={className} {onclick}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.chip {
		background: var(--main);
		background: transparent;
		backdrop-filter: blur(40px);

		&:hover {
			background: var(--main-hover);
			border-color: var(--border-hover);
			// transform: perspective(1000px) scale(1.02);
		}
	}
</style>
