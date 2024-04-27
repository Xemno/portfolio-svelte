<script lang="ts">
	import { onMount } from 'svelte';
	import { onHydrated, theme } from '$lib/stores/theme';
	import TestScene from '$lib/graphics/scenes/testScene';

	let canvas: HTMLCanvasElement;
	let scene: TestScene;

	onMount(() => onHydrated());

	onMount(() => {
		scene = new TestScene(canvas);
		scene.start();

		return () => {
			scene.stop();
		};
	});
</script>

<!-- <canvas id="canvas" class="fixed left-0 top-0 -z-50" bind:this={canvas} /> -->
<canvas id="myCanvas" bind:this={canvas} />

<style lang="scss">
	// body {
	// 	margin: 0;
	// 	overflow: hidden;
	// 	background: black;
	// }

	img {
		display: none;
	}

	.loading {
		margin: -50px -50px;
		border: 0.2em dashed white;
		position: absolute;
		width: 100px;
		height: 100px;
		border-radius: 100px;
		animation: load 5s linear infinite;
	}

	@keyframes load {
		0% {
			transform: translateX(50vw) translateY(50vh) rotateZ(0deg);
		}
		100% {
			transform: translateX(50vw) translateY(50vh) rotateZ(360deg);
		}
	}
</style>
