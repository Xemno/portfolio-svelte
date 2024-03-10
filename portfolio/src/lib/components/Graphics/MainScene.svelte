<script lang="ts">
	import { onMount } from 'svelte';
	import { onHydrated, theme } from '$lib/stores/theme';
	import MainScene from '$lib/graphics/scenes/mainScene';

	let canvas: HTMLCanvasElement;
	let scene: MainScene;

	onMount(() => onHydrated());

	onMount(() => {
		scene = new MainScene(canvas);
		scene.start();

		return () => {
			scene.stop();
		};
	});
</script>

<!-- <canvas id="canvas" class="fixed left-0 top-0 -z-50" bind:this={canvas} /> -->
<canvas id="canvas" bind:this={canvas} />

<style lang="scss">
	canvas {
		width: 100vw;
		height: 100vh;
		display: block;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -9999; // NOTE: comment to make input controls accessible, uncomment to bring canvas behind
	}
</style>
