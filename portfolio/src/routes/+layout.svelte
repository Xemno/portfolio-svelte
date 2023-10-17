<script lang="ts">
	import 'uno.css';
	import NavMenu from '$lib/components/NavMenu/NavMenu.svelte';
	import '$lib/index.scss';
	import { onHydrated, theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';
	import { createScene } from '$lib/scenes/scene2';

	onMount(() => onHydrated());

	let canvasElement: HTMLCanvasElement;
	onMount(() => {
		createScene(canvasElement);
	});
</script>

<div class={`body contents ${$theme ? 'theme-dark' : 'theme-light'}`} id="mydiv">
	<NavMenu />
	<div class="content container"><slot /></div>


	<canvas id="canvas1" bind:this={canvasElement} />
</div>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		flex: 1;
		padding: 0px 0px;
	}

	.body {
		margin: 0px;
		background-color: var(--main);
		color: var(--main-text);
		font-family: var(--text-f);
		display: flex;
		flex-direction: column;
		transition-duration: 200ms;

		letter-spacing: 1px;

		min-height: 100vh;

		background: transparent;
	}

	:global(p) {
		margin: 0px;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		margin: 5px 0px;
	}

	canvas {
		width: 100vw;
		height: 100vh;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -9999;
		
	}
</style>
