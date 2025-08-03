<script lang="ts">
	import { onMount } from 'svelte';

	let el: HTMLElement;

	interface Props {
		active?: boolean;
		size?: string;
		classes?: string;
		children?: import('svelte').Snippet;
	}

	let { active = false, size = 'auto', classes = '', children }: Props = $props();

	let className = ` chip line-clamp-1 row-center  py-[5px] px-[15px] m-[2.5px]  border-[1px] border-solid border-[var(--border)] rounded-[20px] tracking-wider text-[0.9em] text-[var(--tertiary-text)] duration-[150ms] font-light ${classes}`;

	onMount(() => {
		el.style.setProperty('--size', size);
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<svelte:element this={'div'} bind:this={el} class={className}>
	{@render children?.()}
</svelte:element>

<style lang="scss">
	.chip {
		background: var(--main);
		background: transparent;
		backdrop-filter: blur(40px);

		&:hover {
			border-color: var(--border-hover);
		}
	}
</style>
