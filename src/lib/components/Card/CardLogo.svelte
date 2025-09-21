<script lang="ts">
	import { type Asset, type AssetExtended, type Icon } from '$lib/types';
	import UIcon from '../Icon/UIcon.svelte';

	interface Props {
		src: Asset;
		alt: string;
		size?: number;
		radius?: string;
		classes?: string;
	}

	let { src, alt, size = 50, radius = '10px', classes = '' }: Props = $props();
</script>

{#if typeof src === 'string'}
	{#if src.startsWith('i-')}
		<UIcon icon={src as Icon} classes={`${classes}`} />
	{:else}
		<img class={`rounded-${radius} ${classes} w-fit`} {src} {alt} height={size} width={size} />
	{/if}
{:else}
	<img
		class={`rounded-${radius} ${classes} block [[data-theme=dark]_&]:hidden`}
		src={(src as AssetExtended).light}
		{alt}
	/>
	<img
		class={`rounded-${radius} ${classes} hidden [[data-theme=dark]_&]:block`}
		src={(src as AssetExtended).dark}
		{alt}
	/>
{/if}
